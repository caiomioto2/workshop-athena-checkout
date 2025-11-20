import { NextRequest, NextResponse } from 'next/server';

interface PaymentRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  amount: number;
}

interface AbaCatePayPixResponse {
  qrCode: string;
  qrCodeUrl: string;
  txid: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    // Validação básica
    if (!body.name || !body.email || !body.phone || !body.cpf || !body.amount) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validações simples
    if (!body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const cleanCPF = body.cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      );
    }

    // Configuração da API AbaCatePay
    const abaCatePayUrl = process.env.ABACATEPAY_API_URL || 'https://api.abacatepay.com/v1';
    const apiKey = process.env.ABACATEPAY_API_KEY;

    if (!apiKey) {
      console.error('ABACATEPAY_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Configuração de pagamento incompleta' },
        { status: 500 }
      );
    }

    // Criar cobrança Pix no AbaCatePay
    const pixPayload = {
      frequency: 'one-time',
      methods: ['pix'],
      products: [
        {
          externalId: `workshop-${Date.now()}`,
          name: 'Workshop athena.agi - CLI Tools',
          description: 'Workshop de Claude Code & Gemini CLI - Networking & Hands-on',
          quantity: 1,
          price: body.amount * 100 // AbaCatePay usa centavos
        }
      ],
      customer: {
        name: body.name,
        cellphone: body.phone.replace(/\D/g, ''), // Remove formatação
        email: body.email,
        taxId: body.cpf.replace(/\D/g, '') // Remove formatação do CPF
      },
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`,
      completionUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`
    };

    console.log('Criando cobrança no AbaCatePay...');

    const response = await fetch(`${abaCatePayUrl}/billing/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(pixPayload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro na API AbaCatePay:', errorData);
      return NextResponse.json(
        { error: 'Erro ao processar pagamento. Tente novamente.' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Estrutura de resposta do AbaCatePay
    const pixData: AbaCatePayPixResponse = {
      qrCode: data.bill?.pix?.qrCode || data.qrCode || '',
      qrCodeUrl: data.bill?.pix?.qrCodeUrl || data.qrCodeUrl || '',
      txid: data.bill?.id || data.id || '',
      status: data.bill?.status || data.status || 'PENDING'
    };

    // Retornar dados do Pix para o frontend
    return NextResponse.json(pixData, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento' },
      { status: 500 }
    );
  }
}

// Webhook para receber notificações de pagamento do AbaCatePay
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Webhook recebido do AbaCatePay:', body);

    // Aqui você pode adicionar lógica para:
    // - Verificar assinatura do webhook
    // - Atualizar status do pagamento no banco de dados
    // - Enviar email de confirmação para o cliente
    // - Liberar acesso ao workshop

    const { status, billId, metadata } = body;

    if (status === 'PAID' || status === 'COMPLETED') {
      // Pagamento confirmado
      console.log(`Pagamento confirmado para bill ID: ${billId}`);

      // TODO: Implementar lógica de confirmação
      // - Salvar no banco de dados
      // - Enviar email com informações do workshop
      // - Registrar participante
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
