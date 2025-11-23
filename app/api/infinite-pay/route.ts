import { NextRequest, NextResponse } from "next/server";

interface PaymentRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  amount: number;
  paymentMethod: "credit" | "debit" | "pix";
  installments?: number;
  productId?: string;
  productVariantId?: string;
}

interface InfinitePayCheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  paymentId?: string;
  deeplink?: string;
  qrCode?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    // Validação básica
    if (!body.name || !body.email || !body.phone || !body.cpf || !body.amount) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    // Configuração do Infinite Pay baseada na loja
    const handle = process.env.INFINITE_PAY_HANDLE || "agentikai";
    const merchantDoc =
      process.env.INFINITE_PAY_MERCHANT_DOC || "27346981000144";
    const apiKey = process.env.INFINITE_PAY_API_KEY;

    if (!apiKey) {
      console.error("INFINITE_PAY_API_KEY não configurada");
      return NextResponse.json(
        { error: "Configuração de pagamento incompleta" },
        { status: 500 },
      );
    }

    // Gerar ID do pedido
    const orderId = `wkccpro-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // URL de retorno após pagamento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/success?order_id=${orderId}`;

    // Dados do cliente
    const customerData = {
      name: body.name,
      email: body.email,
      phone: body.phone.replace(/\D/g, ""),
      document: body.cpf.replace(/\D/g, ""),
    };

    // Dados do produto (Workshop Claude Code Pro)
    const productData = {
      name: "Workshop Claude Code Pro",
      description:
        "Workshop de Claude Code & Gemini CLI - Networking & Hands-on",
      price: body.amount, // Já está em reais
      quantity: 1,
      sku: body.productId || "wkccpro-workshop-claude-code-pro",
    };

    // Dados do pedido
    const orderData = {
      external_id: orderId,
      customer: customerData,
      items: [productData],
      total_amount: body.amount,
      payment: {
        method: body.paymentMethod,
        installments: body.installments || 1,
        callback_url: `${baseUrl}/api/infinite-pay/webhook`,
      },
      metadata: {
        source: "athena-workshop-website",
        product_type: "workshop",
      },
    };

    console.log("Criando checkout no Infinite Pay...", {
      orderId,
      amount: body.amount,
    });

    try {
      // Tentar criar checkout transparente via API
      const checkoutResponse = await fetch(
        "https://api.infinitepay.io/v1/checkouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "X-InfinitePay-Handle": handle,
          },
          body: JSON.stringify(orderData),
        },
      );

      if (checkoutResponse.ok) {
        const checkoutData = await checkoutResponse.json();

        const response: InfinitePayCheckoutResponse = {
          success: true,
          checkoutUrl: checkoutData.checkout_url,
          paymentId: checkoutData.id || orderId,
        };

        return NextResponse.json(response, { status: 200 });
      }

      // Se falhar a API, tenta com deeplink do Infinite Tap
      console.log("API falhou, usando deeplink fallback...");
    } catch (apiError) {
      console.log("Erro na API, usando deeplink fallback:", apiError);
    }

    // Fallback: Gerar deeplink do Infinite Tap
    const params = new URLSearchParams({
      handle: handle,
      doc_number: merchantDoc,
      amount: Math.round(body.amount * 100).toString(), // Converter para centavos
      payment_method: body.paymentMethod,
      installments: body.installments?.toString() || "1",
      order_id: orderId,
      result_url: returnUrl,
      app_client_referrer: "athena-workshop",
      customer_name: body.name,
      customer_email: body.email,
      customer_phone: body.phone.replace(/\D/g, ""),
      customer_document: body.cpf.replace(/\D/g, ""),
      af_force_deeplink: "true",
    });

    // Para PIX, gerar código PIX simulado
    if (body.paymentMethod === "pix") {
      const pixCode = generatePixCode(body.amount, orderId, customerData);

      const response: InfinitePayCheckoutResponse = {
        success: true,
        paymentId: orderId,
        qrCode: pixCode,
        checkoutUrl: `${baseUrl}/payment/pix?order_id=${orderId}`,
      };

      return NextResponse.json(response, { status: 200 });
    }

    // Gerar deeplink do Infinite Pay para cartões
    const deeplink = `infinitepaydash://infinitetap-app?${params.toString()}`;

    console.log("Gerando deeplink Infinite Pay:", deeplink);

    const response: InfinitePayCheckoutResponse = {
      success: true,
      deeplink: deeplink,
      paymentId: orderId,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar pagamento Infinite Pay:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar pagamento" },
      { status: 500 },
    );
  }
}

// Webhook para receber notificações do Infinite Pay
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Webhook recebido do Infinite Pay:", body);

    const {
      event,
      data: { payment, order },
    } = body;

    if (event === "payment.confirmed" || event === "payment.approved") {
      const { id: paymentId, status, nsu, authorization_code } = payment;
      const { external_id: orderId } = order;

      console.log(
        `Pagamento confirmado: ${paymentId} - NSU: ${nsu} - Pedido: ${orderId}`,
      );

      // TODO: Implementar lógica de confirmação
      // - Salvar no banco de dados
      // - Enviar email com informações do workshop
      // - Registrar participante
      // - Atualizar status do pedido

      // Enviar confirmação para o cliente
      await sendConfirmationEmail(orderId, paymentId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook Infinite Pay:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 },
    );
  }
}

// Função auxiliar para gerar código PIX
function generatePixCode(
  amount: number,
  orderId: string,
  customer: any,
): string {
  const payload = {
    key: process.env.PIX_KEY || "agentikai@infinitepay.io",
    name: "AGENTIKAI COMERCIO DE SOFTWARE",
    city: "SAO PAULO",
    amount: amount.toFixed(2),
    txid: orderId.substring(0, 25),
    description: `Workshop Claude Code Pro - ${customer.name}`,
  };

  // Simplified BR Code generation
  const payloadFormat = `00020126380014BR.GOV.BCB.PIX0114${payload.key}0214${payload.name}520400005303986540${amount.toString().replace(".", "").padStart(10, "0")}5802BR5914${payload.city}6009SAO PAULO62070503***6304${payload.txid.substring(0, 4)}`;

  return payloadFormat;
}

// Função para enviar email de confirmação (mock)
async function sendConfirmationEmail(orderId: string, paymentId: string) {
  console.log(
    `Email de confirmação enviado para pedido ${orderId} - pagamento ${paymentId}`,
  );
  // TODO: Implementar envio real de email
}

// Endpoint para verificar status do pagamento
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json({ error: "Order ID required" }, { status: 400 });
  }

  // TODO: Consultar status real no Infinite Pay
  const mockStatus = {
    order_id: orderId,
    status: "pending",
    payment_method: "credit",
    amount: 97.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return NextResponse.json(mockStatus, { status: 200 });
}
