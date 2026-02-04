import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/notifications';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    try {
        // Advanced sanitization: remove all non-printable characters and whitespace
        const accessToken = process.env.MP_ACCESS_TOKEN?.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();

        // Robust Base URL logic: Env Var -> Vercel URL -> Localhost fallback
        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim().replace(/\/$/, "");
        if (!baseUrl && process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        }

        console.log("Base URL being used:", baseUrl);

        if (accessToken) {
            console.log(`Token loaded. Length: ${accessToken.length}, Starts with: ${accessToken.substring(0, 8)}...`);
        }

        if (!accessToken) {
            console.error("CRITICAL: MP_ACCESS_TOKEN is missing");
            return NextResponse.json(
                { error: "Payment configuration error" },
                { status: 500 }
            );
        }

        if (!baseUrl) {
            console.error("CRITICAL: NEXT_PUBLIC_BASE_URL is missing");
            return NextResponse.json(
                { error: "Environment configuration error" },
                { status: 500 }
            );
        }

        const rawBody = await request.text();
        const sanitizedBody = rawBody.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
        let body: any;
        try {
            body = sanitizedBody ? JSON.parse(sanitizedBody) : {};
        } catch (parseError: any) {
            console.error('Invalid JSON body:', sanitizedBody);
            return NextResponse.json(
                {
                    error: "Invalid JSON body",
                    details: process.env.DEBUG_MP === '1' ? parseError?.message : undefined,
                    body_preview: process.env.DEBUG_MP === '1' ? sanitizedBody.slice(0, 200) : undefined,
                },
                { status: 400 }
            );
        }
        const phoneDigits = String(body.phone || '').replace(/\D/g, '');
        const orderNsu = body.order_nsu || `NB-${Date.now()}`;

        // Validate request
        if (!body.email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }
        if (!body.name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }
        if (!phoneDigits || phoneDigits.length < 8) {
            return NextResponse.json(
                { error: "Phone is required" },
                { status: 400 }
            );
        }

        console.log('Processing Checkout for:', body.email);

        if (process.env.DEBUG_MP === '1') {
            try {
                const methodsResponse = await fetch('https://api.mercadopago.com/v1/payment_methods', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const methods = await methodsResponse.json();
                const bankTransfers = Array.isArray(methods)
                    ? methods.filter((m) => m?.payment_type_id === 'bank_transfer')
                    : [];
                const pix = bankTransfers.find((m) => String(m?.id || '').toLowerCase() === 'pix');
                console.log('MP payment_methods bank_transfer:', bankTransfers.map((m) => ({
                    id: m?.id,
                    name: m?.name,
                    status: m?.status,
                })));
                console.log('MP pix availability:', pix ? { id: pix.id, status: pix.status } : 'not returned by /v1/payment_methods');
            } catch (methodsError) {
                console.error('MP payment_methods debug error:', methodsError);
            }
        }

        // Create preference payload
        const preferenceData = {
            items: [
                {
                    id: 'workshop-athena',
                    title: body.description || 'Workshop Nanobanana Core',
                    quantity: 1,
                    unit_price: Number(body.transaction_amount) || 27.90,
                    currency_id: 'BRL',
                }
            ],
            payer: {
                email: body.email,
                name: body.name.split(' ')[0],
                surname: body.name.split(' ').slice(1).join(' ') || 'Member',
                phone: {
                    area_code: phoneDigits.substring(0, 2),
                    number: phoneDigits.substring(2),
                },
            },
            metadata: {
                whatsapp: phoneDigits,
                order_nsu: orderNsu,
            },
            external_reference: orderNsu,
            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}?status=failure`,
                pending: `${baseUrl}/success`,
            },
            notification_url: `${baseUrl}/api/mercadopago/webhook`,
            statement_descriptor: "WORKSHOP NB",
            payment_methods: {
                excluded_payment_types: [
                    { id: "ticket" },        // Exclui boleto
                    { id: "debit_card" }     // Exclui cartão de débito
                ],
                installments: 12
            },
            auto_return: 'approved',
        };

        // NOTIFICATION: CHECKOUT CREATED (FORM SENT)
        const message = `
📝 *NOVO CHECKOUT INICIADO!*

👤 *Nome:* ${body.name}
📧 *Email:* ${body.email}
📱 *Whatsapp:* ${phoneDigits}
💰 *Valor:* R$ ${Number(body.transaction_amount || 27.90).toFixed(2)}
DATE: ${new Date().toLocaleTimeString('pt-BR')}

⏳ _Aguardando pagamento..._
        `.trim();

        // Fire and forget (don't await to avoid blocking, but log)
        sendTelegramMessage({ message, source: 'checkout-init' }).catch(e => console.error("Async notify error", e));

        const prefResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferenceData),
        });

        const prefText = await prefResponse.text();
        let result: any = {};
        try {
            result = prefText ? JSON.parse(prefText) : {};
        } catch (parseError) {
            result = { raw: prefText };
        }

        if (!prefResponse.ok) {
            throw new Error(result?.message || result?.raw || 'Mercado Pago preference error');
        }

        console.log('Preference created successfully. ID:', result.id);

        return NextResponse.json({
            id: result.id,
            sandbox_init_point: result.sandbox_init_point,
            init_point: result.init_point
        });

    } catch (error: any) {
        // Log internally, but never send detailed error objects to frontend in PROD
        console.error('Mercado Pago Error:', error);

        if (process.env.DEBUG_MP === '1') {
            return NextResponse.json(
                {
                    error: error?.message || "Processing error",
                    details: error?.cause || error,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                error: "Processing error. Please try again later.",
            },
            { status: 500 }
        );
    }
}
