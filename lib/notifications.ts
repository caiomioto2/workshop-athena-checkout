
export async function sendTelegramMessage(params: {
    message: string;
    source: string; // 'checkout' or 'webhook'
}) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    console.log(`[Telegram] Attempting to send message from ${params.source}`);
    console.log(`[Telegram] Token exists: ${!!token}, ChatID exists: ${!!chatId}`);

    if (!token || !chatId) {
        console.error("[Telegram] CRITICAL: Missing credentials");
        return;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: params.message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();
        console.log(`[Telegram] Send result: ${response.ok ? 'SUCCESS' : 'FAILED'}`, result);

        if (!response.ok) {
            console.error("[Telegram] Error details:", JSON.stringify(result));
        }
    } catch (error) {
        console.error("[Telegram] Network/Fetch error:", error);
    }
}
