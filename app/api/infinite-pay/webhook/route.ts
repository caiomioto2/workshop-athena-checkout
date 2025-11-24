import { NextRequest, NextResponse } from "next/server";

interface WebhookPayload {
  invoice_slug: string;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: string;
  transaction_nsu: string;
  order_nsu: string;
  receipt_url: string;
  items?: Array<{
    name: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebhookPayload = await request.json();

    console.log("Webhook recebido da Infinite Pay:", body);

    // Validate webhook data
    if (!body.transaction_nsu || !body.order_nsu || !body.invoice_slug) {
      console.error("Webhook inválido: dados essenciais faltando");
      return NextResponse.json(
        {
          success: false,
          message: "Dados essenciais faltando",
        },
        { status: 400 },
      );
    }

    // Process payment confirmation
    const {
      invoice_slug,
      amount,
      paid_amount,
      installments,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
      items,
      metadata,
    } = body;

    // TODO: Implementar lógica de negócio aqui
    // - Atualizar status do pedido no banco de dados
    // - Enviar email de confirmação para o cliente
    // - Registrar participante no workshop
    // - Gerar certificado ou acesso ao conteúdo
    // - Notificar equipe interna

    console.log(`✅ Pagamento confirmado:`, {
      order_nsu,
      transaction_nsu,
      amount: paid_amount / 100, // Convert from cents to BRL
      method: capture_method,
      installments,
      receipt_url,
    });

    // Log para auditoria
    const auditLog = {
      event: "payment_confirmed",
      timestamp: new Date().toISOString(),
      invoice_slug,
      order_nsu,
      transaction_nsu,
      amount: paid_amount / 100,
      capture_method,
      installments,
      receipt_url,
      metadata,
    };

    console.log("📋 Log de auditoria:", auditLog);

    // TODO: Salvar log em sistema persistente (banco de dados, arquivo, etc.)

    // Responder rapidamente para a Infinite Pay (como documentado)
    return NextResponse.json(
      {
        success: true,
        message: "Pagamento processado com sucesso",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao processar webhook Infinite Pay:", error);

    // Em caso de erro, responder com status 400 para que a Infinite Pay tente novamente
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno ao processar webhook",
      },
      { status: 400 },
    );
  }
}

// GET method for testing webhook manually
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const test = searchParams.get("test");

  if (test === "true") {
    // Simulate a test webhook payload
    const testPayload: WebhookPayload = {
      invoice_slug: "test-slug-" + Date.now(),
      amount: 9700, // R$ 97.00 in cents
      paid_amount: 9700,
      installments: 1,
      capture_method: "credit_card",
      transaction_nsu: "test-transaction-" + Date.now(),
      order_nsu: "test-order-" + Date.now(),
      receipt_url: "https://comprovante.teste.com/123",
      items: [
        {
          name: "Workshop Claude Code Pro",
          description: "Workshop de Claude Code & Gemini CLI",
          quantity: 1,
          price: 9700,
        },
      ],
      metadata: {
        source: "athena-workshop-website",
        product_type: "workshop",
      },
    };

    console.log("🧪 Testando webhook com payload simulado:", testPayload);

    return NextResponse.json(
      {
        message: "Webhook endpoint working. Use POST method for real webhooks.",
        test_payload_example: testPayload,
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      message: "Webhook endpoint está funcionando",
      method: "POST",
      usage: "Envie o payload da Infinite Pay via POST",
    },
    { status: 200 },
  );
}
