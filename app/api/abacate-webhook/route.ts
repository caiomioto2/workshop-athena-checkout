import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook AbacatePay recebido:', body);

    // Aqui você pode processar o status do pagamento
    const { charge, event } = body;

    if (event === 'charge.paid') {
      console.log('Pagamento confirmado:', charge.id);

      // Salvar no banco, enviar email de confirmação, etc.
      // await savePayment(charge);
      // await sendConfirmationEmail(charge.customer.email);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}