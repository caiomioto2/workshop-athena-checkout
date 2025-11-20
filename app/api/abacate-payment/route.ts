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
        frequency: 'ONE_TIME',
        methods: ['PIX'],
        products: [{
          externalId: `workshop-${Date.now()}`,
          name: 'Workshop Athena.AGI - Claude Code & Gemini CLI',
          description: 'Workshop de 3 horas com networking e hands-on',
          quantity: 1,
          price: amount
        }],
        customer: {
          name: name,
          cellphone: phone.replace(/\D/g, ''),
          email: email || `${phone.replace(/\D/g, '')}@temp.workshop`,
          taxId: '00000000000'
        },
        returnUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        completionUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`
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

    // AbaCatePay response structure
    return NextResponse.json({
      success: true,
      billingId: billingData.id,
      paymentUrl: billingData.url,
      qrCodeUrl: billingData.bill?.pix?.qrCodeUrl || billingData.qrCodeUrl,
      qrCode: billingData.bill?.pix?.qrCode || billingData.qrCode,
      amount: amount,
      expiresAt: billingData.devolutionAt
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