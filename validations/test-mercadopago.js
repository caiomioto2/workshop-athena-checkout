const { MercadoPagoConfig, Payment } = require('mercadopago');

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
    console.error('Missing MP_ACCESS_TOKEN. Set it in your environment before running this script.');
    process.exit(1);
}

console.log('--- Testing Mercado Pago Credentials ---');
console.log('Access Token:', accessToken.substring(0, 10) + '...');

const client = new MercadoPagoConfig({ accessToken });
const payment = new Payment(client);

async function testPayment() {
    try {
        const paymentData = {
            transaction_amount: 1.00,
            description: 'Test Validation',
            payment_method_id: 'pix',
            payer: {
                email: 'test_user_123456@testuser.com', // Using a generic test email
                identification: {
                    type: 'CPF',
                    number: '19119119100' // Generic valid CPF
                }
            }
        };

        console.log('Attempting to create PIX payment...');
        const result = await payment.create({ body: paymentData });

        console.log('✅ SUCCESS! Credentials are working.');
        console.log('Payment ID:', result.id);
        console.log('Status:', result.status);
    } catch (error) {
        console.error('❌ ERROR! Credentials failed.');
        console.error('Status Code:', error.status);
        console.error('Message:', error.message);

        if (error.cause) {
            console.error('Details:', JSON.stringify(error.cause, null, 2));
        }
    }
}

testPayment();
