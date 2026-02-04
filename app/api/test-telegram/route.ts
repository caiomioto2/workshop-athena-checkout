import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/notifications';

export const runtime = 'nodejs';

export async function POST() {
    try {
        console.log("Testing Telegram Notifications...");

        // Test 1: Checkout Started
        const msgInit = `
📝 *TESTE LOCAL: CHECKOUT INICIADO*

👤 *Nome:* Tester Local
📧 *Email:* test.local@example.com
💰 *Valor:* R$ 27,90
📅 *Hora:* ${new Date().toLocaleTimeString('pt-BR')}

⏳ _Aguardando pagamento..._
        `.trim();

        await sendTelegramMessage({ message: msgInit, source: 'test-local-init' });

        // Test 2: Payment Pending
        const msgPending = `
⏳ *TESTE LOCAL: STATUS PENDENTE*

💰 *Valor:* R$ 27,90
🆔 *ID:* \`TEST-PENDING-LOCAL\`
📅 *Hora:* ${new Date().toLocaleTimeString('pt-BR')}
📊 *Status:* PENDENTE / PIX GERADO

🚀 _Testando Localmente_
        `.trim();
        await sendTelegramMessage({ message: msgPending, source: 'test-local-pending' });

        return NextResponse.json({ success: true, message: "Notifications sent! Check your Telegram." });
    } catch (error) {
        console.error("Test failed:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
