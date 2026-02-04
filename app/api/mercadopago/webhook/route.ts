import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/notifications';

export const runtime = 'nodejs';

type NotionDatabase = {
  id: string;
  properties?: Record<string, { type: string }>;
};

type NotionSearchResult = {
  results?: Array<{
    object?: string;
    id?: string;
    title?: Array<{ plain_text?: string }>;
  }>;
};

const NOTION_VERSION = '2022-06-28';

const getNotionHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Notion-Version': NOTION_VERSION,
});

const findTitleProperty = (db: NotionDatabase) => {
  if (!db.properties) return 'Name';
  const entry = Object.entries(db.properties).find(([, prop]) => prop.type === 'title');
  return entry?.[0] || 'Name';
};

const setPropertyValue = (
  db: NotionDatabase,
  props: Record<string, any>,
  name: string,
  value: string | number | null,
) => {
  if (!db.properties || !db.properties[name]) return;
  const type = db.properties[name].type;
  if (value === null || value === undefined) return;
  switch (type) {
    case 'email':
      props[name] = { email: String(value) };
      break;
    case 'phone_number':
      props[name] = { phone_number: String(value) };
      break;
    case 'number':
      props[name] = { number: Number(value) };
      break;
    case 'select':
      props[name] = { select: { name: String(value) } };
      break;
    case 'date':
      props[name] = { date: { start: String(value) } };
      break;
    case 'url':
      props[name] = { url: String(value) };
      break;
    case 'rich_text':
    default:
      props[name] = { rich_text: [{ type: 'text', text: { content: String(value) } }] };
      break;
  }
};

const resolveDatabaseId = async (token: string) => {
  const explicitId = process.env.NOTION_DATABASE_ID;
  if (explicitId) return explicitId;

  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: getNotionHeaders(token),
    body: JSON.stringify({
      query: 'CRM',
      filter: { value: 'database', property: 'object' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion search failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as NotionSearchResult;
  const db = data.results?.find((item) => {
    const title = item.title?.map((t) => t.plain_text).join('') || '';
    return item.object === 'database' && title.toLowerCase() === 'crm';
  });

  if (!db?.id) {
    throw new Error('CRM database not found in Notion.');
  }

  return db.id;
};

const fetchDatabase = async (token: string, databaseId: string) => {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: 'GET',
    headers: getNotionHeaders(token),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion database fetch failed: ${response.status} ${text}`);
  }

  return (await response.json()) as NotionDatabase;
};

const createNotionPage = async (token: string, databaseId: string, payload: {
  name: string;
  email: string;
  phone: string;
  amount: number;
  paymentId: string;
  status: string;
  approvedAt?: string | null;
  source?: string | null;
}) => {
  const db = await fetchDatabase(token, databaseId);
  const titleProperty = findTitleProperty(db);
  const properties: Record<string, any> = {
    [titleProperty]: {
      title: [
        {
          type: 'text',
          text: { content: payload.name || payload.email || 'Compra Workshop' },
        },
      ],
    },
  };

  setPropertyValue(db, properties, 'Email', payload.email);
  setPropertyValue(db, properties, 'Telefone', payload.phone);
  setPropertyValue(db, properties, 'Phone', payload.phone);
  setPropertyValue(db, properties, 'Payment ID', payload.paymentId);
  setPropertyValue(db, properties, 'Status', payload.status);
  setPropertyValue(db, properties, 'Valor', payload.amount);
  setPropertyValue(db, properties, 'Amount', payload.amount);
  setPropertyValue(db, properties, 'Approved At', payload.approvedAt || null);
  setPropertyValue(db, properties, 'Source', payload.source || 'Mercado Pago');

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: getNotionHeaders(token),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion page create failed: ${response.status} ${text}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const notionToken = process.env.NOTION_TOKEN; // Optional now?

    if (!accessToken) {
      console.error("MP_ACCESS_TOKEN missing");
      return NextResponse.json({ received: true });
    }

    const url = new URL(request.url);
    const queryId = url.searchParams.get('id') || url.searchParams.get('data.id');
    const body = await request.json().catch(() => ({}));
    const dataId = body?.data?.id || body?.id;
    const paymentId = String(queryId || dataId || '');

    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!paymentResponse.ok) {
      const text = await paymentResponse.text();
      console.error('Mercado Pago payment fetch failed:', text);
      return NextResponse.json({ received: true });
    }

    const payment = await paymentResponse.json();

    // Send Telegram Notification for ALL statuses
    let statusIcon = '⚠️';
    let statusText = payment.status;

    if (payment.status === 'approved') {
      statusIcon = '✅';
      statusText = 'APROVADO / SUCESSO';
    } else if (payment.status === 'pending') {
      statusIcon = '⏳';
      statusText = 'PENDENTE / PIX GERADO';
    } else if (payment.status === 'rejected') {
      statusIcon = '❌';
      statusText = 'REJEITADO';
    }

    const message = `
${statusIcon} *ATUALIZAÇÃO DE PAGAMENTO*

💰 *Valor:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payment.transaction_amount)}
📧 *Email:* ${payment.payer?.email || 'N/A'}
🆔 *ID:* \`${payment.id}\`
📅 *Hora:* ${new Date().toLocaleTimeString('pt-BR')}
📊 *Status:* ${statusText}

🚀 _Workshop Nanobanana Core_
    `.trim();

    await sendTelegramMessage({ message, source: 'webhook' });

    if (payment.status === 'approved') {
      // Save to Notion if token exists (Keep existing logic if Notion is used)
      if (notionToken) {
        const payerEmail = payment?.payer?.email || '';
        const payerName = [payment?.payer?.first_name, payment?.payer?.last_name]
          .filter(Boolean)
          .join(' ')
          .trim();
        const phone = payment?.payer?.phone
          ? `${payment.payer.phone.area_code || ''}${payment.payer.phone.number || ''}`
          : '';

        try {
          const databaseId = await resolveDatabaseId(notionToken);
          await createNotionPage(notionToken, databaseId, {
            name: payerName,
            email: payerEmail,
            phone,
            amount: payment?.transaction_amount || 0,
            paymentId: String(payment.id),
            status: payment.status,
            approvedAt: payment?.date_approved || null,
            source: 'Mercado Pago',
          });
        } catch (e) {
          console.error("Notion save failed", e);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Mercado Pago webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
