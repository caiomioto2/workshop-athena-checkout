import { NextRequest, NextResponse } from 'next/server';

interface VerificationRequest {
  handle: string;
  order_nsu: string;
  transaction_nsu: string;
  slug: string;
}

interface VerificationResponse {
  success: boolean;
  paid: boolean;
  amount?: number;
  paid_amount?: number;
  installments?: number;
  capture_method?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json();

    // Validation
    if (!body.handle || !body.order_nsu || !body.transaction_nsu || !body.slug) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros de verificação incompletos' },
        { status: 400 }
      );
    }

    // Infinite Pay API endpoint for payment verification
    const infinitePayUrl = 'https://api.infinitepay.io/invoices/public/checkout/payment_check';

    const verificationPayload = {
      handle: body.handle,
      order_nsu: body.order_nsu,
      transaction_nsu: body.transaction_nsu,
      slug: body.slug
    };

    console.log('Verificando pagamento Infinite Pay:', verificationPayload);

    // Call Infinite Pay API
    const response = await fetch(infinitePayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na verificação Infinite Pay:', errorData);

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || 'Erro ao verificar pagamento'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Pagamento verificado:', data);

    const verificationResponse: VerificationResponse = {
      success: true,
      paid: data.paid || false,
      amount: data.amount,
      paid_amount: data.paid_amount,
      installments: data.installments,
      capture_method: data.capture_method
    };

    return NextResponse.json(verificationResponse, { status: 200 });

  } catch (error) {
    console.error('Erro ao verificar pagamento Infinite Pay:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno ao verificar pagamento'
      },
      { status: 500 }
    );
  }
}

// GET method to verify from query parameters (for easier testing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const handle = searchParams.get('handle') || 'agentikai';
    const order_nsu = searchParams.get('order_nsu');
    const transaction_nsu = searchParams.get('transaction_nsu');
    const slug = searchParams.get('slug');

    if (!order_nsu || !transaction_nsu || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parâmetros necessários: order_nsu, transaction_nsu, slug'
        },
        { status: 400 }
      );
    }

    // Call the POST verification logic
    const verificationRequest = {
      handle,
      order_nsu,
      transaction_nsu,
      slug
    };

    // Call Infinite Pay API
    const infinitePayUrl = 'https://api.infinitepay.io/invoices/public/checkout/payment_check';

    const response = await fetch(infinitePayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationRequest)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || 'Erro ao verificar pagamento'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      ...data
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao verificar pagamento (GET):', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno ao verificar pagamento'
      },
      { status: 500 }
    );
  }
}
