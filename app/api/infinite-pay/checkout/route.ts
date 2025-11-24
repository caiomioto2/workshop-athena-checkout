import { NextRequest, NextResponse } from "next/server";

interface CheckoutRequest {
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  order_nsu: string;
  redirect_url: string;
  webhook_url?: string;
}

interface CheckoutResponse {
  success: boolean;
  url?: string;
  order_nsu?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    // Validation
    if (
      !body.customer?.name ||
      !body.customer?.email ||
      !body.customer?.document ||
      !body.order_nsu
    ) {
      return NextResponse.json(
        { success: false, error: "Dados do cliente incompletos" },
        { status: 400 },
      );
    }

    // Infinite Pay API endpoint for checkout creation (documentação oficial)
    const infinitePayUrl =
      "https://api.infinitepay.io/invoices/public/checkout/links";

    // Preparar payload conforme documentação da Infinite Pay
    const checkoutPayload = {
      handle: "agentikai", // Sua Infinite Tag
      redirect_url:
        body.redirect_url ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success`,
      order_nsu: body.order_nsu,
      items: body.items || [
        {
          quantity: 1,
          price: 500, // R$ 5,00 em centavos (para teste)
          description: "Workshop Claude Code Pro",
        },
      ],
      // Incluir dados do cliente do formulário
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone_number: body.customer.phone
          ? `+55${body.customer.phone.replace(/\D/g, "")}`
          : undefined,
      },
    };

    console.log("🚀 Criando checkout na Infinite Pay API:", checkoutPayload);

    // Chamar API da Infinite Pay
    const response = await fetch(infinitePayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkoutPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Erro na API Infinite Pay:", errorData);

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Erro ao criar checkout",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    console.log("✅ Checkout criado com sucesso:", data);

    const checkoutResponse: CheckoutResponse = {
      success: true,
      url: data.url, // URL do checkout gerada pela Infinite Pay
      order_nsu: body.order_nsu,
    };

    return NextResponse.json(checkoutResponse, { status: 200 });
  } catch (error) {
    console.error("Erro ao criar checkout Infinite Pay:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao processar pagamento",
      },
      { status: 500 },
    );
  }
}
