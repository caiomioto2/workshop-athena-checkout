import { NextRequest, NextResponse } from 'next/server';

const ABACATEPAY_API_KEY = process.env.ABACATEPAY_API_KEY;
const ABACATEPAY_API_URL = process.env.ABACATEPAY_API_URL || 'https://api.abacatepay.com/v1/billing/create';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://whk.agentikai.com.br/webhook/abacate-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, amount = 2000 } = body; // R$ 20,00 em centavos

    // Validate API key configuration
    if (!ABACATEPAY_API_KEY) {
      console.error('ABACATEPAY_API_KEY não configurada');
      return NextResponse.json(
        { success: false, error: 'Configuração de pagamento incompleta' },
        { status: 500 }
      );
    }

    console.log('Criando pagamento AbacatePay:', { name, phone, amount });

    // Criar cobrança direta no AbacatePay
    const billingResponse = await fetch(ABACATEPAY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        description: 'Workshop Claude Code Pro - 3h Ao Vivo',
        customer: {
          name: name,
          phone: phone,
          email: email || `${phone.replace(/\D/g, '')}@temp.workshop`
        },
        methods: ['PIX'],
        frequency: 'once', // Pagamento único
        webhook: WEBHOOK_URL,
        expires_in: 3600, // 1 hora
        metadata: {
          workshop: 'claude-code-pro',
          customer_phone: phone,
          source: 'workshop-checkout'
        }
      })
    });

    if (!billingResponse.ok) {
      const errorData = await billingResponse.text();
      console.error('Erro AbacatePay:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: `Erro ao criar cobrança: ${billingResponse.status} - ${errorData}`
        },
        { status: 400 }
      );
    }

    const billingData = await billingResponse.json();
    console.log('Cobrança criada:', billingData);

    // Envia dados do cliente para o n8n
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'customer_data',
          name: name,
          phone: phone,
          amount: amount,
          billing_id: billingData.id,
          status: 'pending',
          created_at: new Date().toISOString()
        })
      });
    } catch (webhookError) {
      console.warn('Erro ao enviar para webhook n8n:', webhookError);
    }

    return NextResponse.json({
      success: true,
      billingId: billingData.id,
      paymentUrl: billingData.url,
      qrCodeUrl: billingData.qr_code?.url,
      qrCode: billingData.qr_code?.text,
      amount: amount,
      expiresAt: billingData.expires_at
    });

  } catch (error) {
    console.error('Erro no pagamento:', error);
    return NextResponse.json(
      {
        success: false,
        error: `Erro ao processar pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      },
      { status: 500 }
    );
  }
}