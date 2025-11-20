# Workshop Athena.agi - Project Context

## Quick Reference

**Project Type**: Next.js 16 Landing Page with Payment Integration
**Primary Purpose**: Workshop checkout page for athena.agi CLI Tools workshop
**Status**: Active Development
**Last Updated**: 2025-11-20

## Core Stack

```yaml
framework: Next.js 16.0.3
ui_library: React 19.2.0
language: TypeScript 5
styling: Tailwind CSS 3.3.0
icons: Lucide React 0.460.0
payment: AbaCatePay (Pix Gateway)
```

## Design Language

**Style Name**: "Brutal Doodles"
- Neo-Brutalist base aesthetic
- Playful notebook-inspired elements
- Thick black borders, hard shadows
- Vibrant pastel color palette
- Bold typography throughout
- Tactile interactive effects

## Project Structure Map

```
workshop-athena-checkout/
├── app/
│   ├── api/
│   │   ├── payment/route.ts           # Main payment API (AbaCatePay)
│   │   ├── abacate-payment/           # Additional payment endpoints
│   │   └── abacate-webhook/           # Webhook handlers
│   ├── components/                     # Reusable UI components
│   ├── globals.css                     # Global styles + Tailwind
│   ├── layout.tsx                      # Root layout component
│   └── page.tsx                        # Landing page + checkout form
├── public/                             # Static assets (logos, images)
├── claudedocs/                         # Claude session documentation
│   ├── sessions/                       # Session summaries
│   └── PROJECT_CONTEXT.md             # This file
├── .env.example                        # Environment template
├── .env.local                          # Local environment (gitignored)
├── package.json                        # Dependencies
├── tailwind.config.js                  # Tailwind configuration
└── tsconfig.json                       # TypeScript configuration
```

## Key Files & Purposes

| File | Purpose | Priority |
|------|---------|----------|
| `app/page.tsx` | Main landing page + checkout UI | 🔴 Critical |
| `app/api/payment/route.ts` | Payment processing endpoint | 🔴 Critical |
| `app/api/abacate-webhook/` | Payment status webhooks | 🟡 Important |
| `app/globals.css` | Design system styles | 🟢 Standard |
| `app/components/` | Reusable UI components | 🟢 Standard |

## Environment Configuration

### Required Variables
```env
ABACATEPAY_API_KEY=<your_api_key>
ABACATEPAY_API_URL=https://api.abacatepay.com/v1
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Setup Steps
1. Copy `.env.example` → `.env.local`
2. Get API key from [AbaCatePay](https://abacatepay.com)
3. Configure in Settings > API section
4. Never commit `.env.local` (gitignored)

## Common Tasks

### Development
```bash
npm run dev          # Start dev server → http://localhost:3000
npm run build        # Production build
npm start            # Serve production build
npm run lint         # Run ESLint
```

### Customization Hotspots

**Price Adjustment** (`app/page.tsx`):
- Line 37: `amount: 97.00` (API value)
- Line 171: `<p>R$ 97</p>` (Display value)

**Event Details** (`app/page.tsx`):
- Lines 88-100: Title and description
- Lines 105-140: Event specifics
- Lines 143-162: Learning topics

## Git Workflow

**Current Branch**: `master`
**Remote**: Origin (GitHub)

### Recent History
```
7354714 - Adiciona arquivo .env.example
81f7d0d - Implementa landing page de checkout
da7d804 - Initial commit
```

### Uncommitted Changes
- 12 modified configuration and source files
- New directories: components, API routes, assets
- Ready for structured commit

## Dependencies Architecture

### Production Dependencies
- `next@16.0.3` - Framework
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM
- `lucide-react@0.460.0` - Icon library

### Development Dependencies
- `typescript@5` - Type safety
- `tailwindcss@3.3.0` - Styling
- `autoprefixer@10.4.14` - CSS processing
- `postcss@8.4.24` - CSS transformation
- `@types/*` - TypeScript definitions

## Integration Points

### AbaCatePay Flow
```
1. User submits checkout form
2. POST /api/payment → AbaCatePay API
3. Receive Pix QR code + copy code
4. Display payment UI
5. Webhook receives payment confirmation
6. Update order status
```

### Webhook Security
- Verify webhook signatures
- Validate request origin
- Handle idempotency
- Log all webhook events

## Testing Strategy

### Recommended Tests
- ✅ Payment form validation
- ✅ AbaCatePay API integration
- ✅ Webhook handler verification
- ✅ Responsive design validation
- ✅ Accessibility compliance (WCAG)
- ⏳ E2E checkout flow (Playwright)
- ⏳ Error handling scenarios
- ⏳ Payment timeout handling

### Test Tools
- Playwright for E2E testing
- Jest for unit tests (not configured)
- AbaCatePay sandbox for integration testing

## Deployment

### Platform: Vercel
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Environment Variables (Production)
```
ABACATEPAY_API_KEY=<production_key>
ABACATEPAY_API_URL=https://api.abacatepay.com/v1
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## Known Patterns

### Component Structure
```typescript
// Standard component pattern used in project
export default function ComponentName() {
  return (
    <div className="brutal-card">
      {/* Content */}
    </div>
  )
}
```

### API Route Pattern
```typescript
// Standard API route structure
export async function POST(request: Request) {
  const body = await request.json()
  // Process request
  return Response.json({ success: true })
}
```

## Code Style Guidelines

### TypeScript
- Use strict mode
- Explicit return types for functions
- Interface over type for objects
- Prefer const over let

### React
- Functional components only
- Use hooks (useState, useEffect)
- Client components marked with 'use client'
- Server components by default

### Tailwind
- Use utility classes directly
- Custom classes in globals.css
- Follow "Brutal Doodles" design tokens
- Responsive-first approach

## Performance Considerations

### Optimization Checklist
- ✅ Next.js Image component for assets
- ✅ Code splitting (automatic)
- ✅ Server components where possible
- ⏳ Image optimization (verify formats)
- ⏳ Bundle analysis
- ⏳ Lighthouse audit

## Security Checklist

### Current Status
- ✅ Environment variables in .env.local
- ✅ .env.local in .gitignore
- ✅ API key not hardcoded
- ⏳ Webhook signature verification
- ⏳ Input validation on all forms
- ⏳ Rate limiting on API routes
- ⏳ CORS configuration
- ⏳ Security headers configuration

## Documentation Resources

### Official Docs
- [Next.js 16 Docs](https://nextjs.org/docs)
- [AbaCatePay API](https://docs.abacatepay.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons)

### Internal Docs
- `README.md` - Setup and deployment guide
- `claudedocs/sessions/` - Session summaries
- `.env.example` - Environment configuration template

## Session Workflow

### Starting New Session
1. `git status` - Check current state
2. `git branch` - Verify branch
3. Read `PROJECT_CONTEXT.md` - This file
4. Read latest session in `claudedocs/sessions/`
5. Resume work

### Ending Session
1. Review changes (`git diff`)
2. Commit logical units
3. Run `/sc:save` for session documentation
4. Update PROJECT_CONTEXT.md if needed

## Quick Commands Reference

```bash
# Git
git status                    # Check status
git diff                      # Review changes
git add .                     # Stage all
git commit -m "message"       # Commit

# Development
npm run dev                   # Start dev server
npm run build                 # Production build

# Session Management
/sc:save                      # Save session context
/sc:load                      # Load session context

# File Operations
ls -la app/                   # List files
find . -name "*.tsx"          # Find TypeScript files
grep -r "pattern" app/        # Search in files
```

## Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
npm run dev                     # Restart
```

**Module not found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run build  # Check build errors
# Fix type errors, don't use @ts-ignore
```

**Payment API errors**
- Verify API key in .env.local
- Check AbaCatePay API status
- Review network logs in browser DevTools

## Notes for AI Assistants

### Context Loading
This file provides comprehensive project context for quick session resumption. Read this file first when starting new sessions.

### Key Principles
- Follow "Brutal Doodles" design system
- Maintain TypeScript strict mode
- Test payment flow in sandbox first
- Never commit environment variables
- Document all API changes

### Serena MCP Integration
Project is not yet registered with Serena MCP. Consider:
1. Registering project for better memory
2. Using symbolic tools for code navigation
3. Leveraging session persistence features

---

**Last Context Update**: 2025-11-20
**Context Version**: 1.0
