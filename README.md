# Workshop Nanobanana Core - Landing Page com Checkout

Landing page do workshop com checkout via Mercado Pago (redirect). Foco em conversão e experiência "Gemini/Terminal".

## 🎨 Design

Tema "Gemini/Terminal":
- Fundo escuro e acentos neon
- Tipografia mono + VT323
- Cartões com borda e glow
- CTAs claros e foco em conversão

## 🚀 Tecnologias

- **Next.js 16** - App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- **Lucide React**
- **Mercado Pago** - Checkout (redirect)

## 📦 Instalação

```bash
npm install
cp .env.example .env.local
```

## ⚙️ Configuração

Edite `.env.local`:

```env
MP_ACCESS_TOKEN=your_mercado_pago_access_token
NOTION_TOKEN=your_notion_integration_token
# Optional: if not set, we will search for a database named "CRM"
NOTION_DATABASE_ID=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🏃‍♂️ Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

## 🏗️ Build para Produção

```bash
npm run build
npm start
```

## 🚀 Deploy no Vercel

1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente:
   - `MP_ACCESS_TOKEN`
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID` (opcional)
   - `NEXT_PUBLIC_BASE_URL` (URL do seu site no Vercel)
4. Deploy

## 📁 Estrutura do Projeto

```
.
├── app/
│   ├── api/
│   │   └── mercadopago/
│   │       └── checkout/route.ts   # Criação da preferência
│   ├── layout.tsx
│   └── page.tsx                    # Landing page
├── components/
├── public/
├── .env.example
└── package.json
```

## 🎯 Funcionalidades

- ✅ Landing page responsiva
- ✅ Checkout redirect via Mercado Pago
- ✅ Validação básica do formulário
- ✅ Seções de conteúdo e prova

## 📝 Personalização

- Preço e textos principais em `app/page.tsx`
- Preferência do Mercado Pago em `app/api/mercadopago/checkout/route.ts`

## 🔗 Links Úteis

- Documentação Next.js: https://nextjs.org/docs
- Mercado Pago Devs: https://www.mercadopago.com.br/developers
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**Desenvolvido para o Workshop Nanobanana Core**
