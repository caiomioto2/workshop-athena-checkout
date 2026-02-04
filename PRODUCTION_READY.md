# Production Ready Checklist ✅

## Workshop Nanobanana Core - Deploy on Vercel

### ✅ Status
- Landing page completa
- Checkout via Mercado Pago (redirect)
- Formulário com validação básica
- Variáveis de ambiente documentadas

---

## 🚀 Deployment Steps

### 1) Environment Setup
```bash
cp .env.example .env.local
```

Configure:
```env
MP_ACCESS_TOKEN=your_mercado_pago_access_token
NOTION_TOKEN=your_notion_integration_token
# Optional: if not set, we will search for a database named "CRM"
NOTION_DATABASE_ID=
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### 2) Build
```bash
npm install
npm run build
```

### 3) Deploy (Vercel)
- Conecte o repositório
- Adicione as variáveis acima
- Deploy

---

## ✅ Pós-deploy (Checklist)
- [ ] Landing page abre sem erros
- [ ] Checkout redireciona para Mercado Pago
- [ ] Pagamento aprovado cria lead no Notion (DB "CRM")
- [ ] Retorno de sucesso aponta para `/success`

---

## 🔒 Segurança
- Nenhuma credencial hardcoded no repositório
- Tokens apenas via variáveis de ambiente

---

## 💰 Pricing
- **R$ 27,90** (ajuste em `app/page.tsx`)

---

## 🔥 READY TO DEPLOY

Aplicação pronta para Vercel com checkout Mercado Pago.
