# Workshop athena.agi - Landing Page com Checkout

Landing page com checkout transparente para o Workshop de CLI Tools (Claude Code & Gemini CLI).

## 🎨 Design

O projeto usa o estilo **"Brutal Doodles"** - uma estética Neo-Brutalist misturada com uma vibe lúdica de notebook:
- Bordas grossas e pretas
- Sombras duras (hard shadows)
- Cores pastel vibrantes
- Tipografia bold
- Elementos interativos com efeitos táteis

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Lucide React** - Ícones
- **AbaCatePay** - Gateway de pagamento Pix

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local
```

## ⚙️ Configuração

Edite o arquivo `.env.local` com suas credenciais:

```env
# AbaCatePay Configuration
ABACATEPAY_API_KEY=your_api_key_here
ABACATEPAY_API_URL=https://api.abacatepay.com/v1

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Como obter as credenciais do AbaCatePay:

1. Acesse [AbaCatePay](https://abacatepay.com)
2. Crie uma conta ou faça login
3. Vá em **Configurações > API**
4. Copie sua **API Key**
5. Cole no arquivo `.env.local`

## 🏃‍♂️ Desenvolvimento

```bash
# Rodar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🏗️ Build para Produção

```bash
# Criar build de produção
npm run build

# Rodar build localmente
npm start
```

## 🚀 Deploy no Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Faça push do código para o GitHub
2. Conecte seu repositório no Vercel
3. Configure as variáveis de ambiente:
   - `ABACATEPAY_API_KEY`
   - `ABACATEPAY_API_URL`
   - `NEXT_PUBLIC_BASE_URL` (URL do seu site no Vercel)
4. Deploy!

### Variáveis de Ambiente no Vercel

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

- `ABACATEPAY_API_KEY`: Sua chave de API do AbaCatePay
- `ABACATEPAY_API_URL`: `https://api.abacatepay.com/v1`
- `NEXT_PUBLIC_BASE_URL`: URL do seu projeto (ex: `https://seu-projeto.vercel.app`)

## 📁 Estrutura do Projeto

```
.
├── app/
│   ├── api/
│   │   └── payment/
│   │       └── route.ts          # API de pagamento com AbaCatePay
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Landing page com checkout
├── public/                       # Arquivos estáticos
├── .env.example                  # Exemplo de variáveis de ambiente
└── package.json
```

## 🎯 Funcionalidades

- ✅ Landing page responsiva com design Neo-Brutalist
- ✅ Formulário de checkout com validação
- ✅ Integração com AbaCatePay para pagamento Pix
- ✅ Geração de QR Code Pix
- ✅ Cópia de código Pix com um clique
- ✅ Webhook para notificações de pagamento
- ✅ Design responsivo para mobile e desktop

## 📝 Personalização

### Alterar o preço do workshop

Edite o arquivo `app/page.tsx` na linha 37:

```typescript
amount: 97.00 // Valor do workshop
```

E na linha 171:

```tsx
<p className="text-5xl font-black">R$ 97</p>
```

### Alterar informações do evento

Edite as seções do arquivo `app/page.tsx`:
- Título e descrição (linhas 88-100)
- Detalhes do evento (linhas 105-140)
- O que você vai aprender (linhas 143-162)

## 🔗 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação AbaCatePay](https://docs.abacatepay.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## 📄 Licença

Este projeto foi criado para o Workshop athena.agi.

---

**Desenvolvido com ❤️ para athena.agi**
