import { NextRequest, NextResponse } from 'next/server';

const ABACATEPAY_API_KEY = process.env.ABACATEPAY_API_KEY;
const ABACATEPAY_API_URL = process.env.ABACATEPAY_API_URL || 'https://api.abacatepay.com/v1';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://whk.agentikai.com.br/webhook/abacate-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, cpf, amount = 2000 } = body; // R$ 20,00 em centavos

    // Validate API key configuration
    if (!ABACATEPAY_API_KEY) {
      console.error('ABACATEPAY_API_KEY não configurada');
      return NextResponse.json(
        { success: false, error: 'Configuração de pagamento incompleta' },
        { status: 500 }
      );
    }

    console.log('Criando pagamento AbacatePay:', { name, email, phone, cpf, amount });

    // Criar cobrança direta no AbacatePay
    const payload = {
      frequency: 'ONE_TIME',
      methods: ['PIX'],
      products: [{
        externalId: `workshop-${Date.now()}`,
        name: 'Workshop Agentik AI - Claude Code & Gemini CLI',
        description: 'Workshop de 3 horas com networking e hands-on',
        quantity: 1,
        price: amount
      }],
      customer: {
        name: name,
        taxId: cpf,
        cellphone: phone,
        email: email
      },
      returnUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      completionUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`
    };

    console.log('Payload enviado para AbacatePay:', JSON.stringify(payload, null, 2));

    const billingResponse = await fetch(`${ABACATEPAY_API_URL}/billing/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ABACATEPAY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload)
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

    const responseJson = await billingResponse.json();
    console.log('Cobrança criada (FULL):', JSON.stringify(responseJson, null, 2));

    const billingData = responseJson.data;

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
          email: email,
          phone: phone,
          cpf: cpf,
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
      qrCodeUrl: billingData.pix?.qrCodeUrl || billingData.bill?.pix?.qrCodeUrl,
      qrCode: billingData.pix?.qrCode || billingData.bill?.pix?.qrCode,
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
