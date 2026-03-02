# replit.md

## Overview

This project is the **FutureSpeak.AI** website — a personal brand, open-source project, and consulting practice site for Stephen C. Webster, an enterprise AI strategist who built the cLaw Specification (an open standard for AI agent governance) and Agent Friday (the reference implementation).

The site separates two audiences — enterprise consulting clients and open-source developers — while elevating the governance framework as the primary differentiator. It features a premium dark theme with space/star aesthetics, amber/gold accents, and cyan/teal technical elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## Site Architecture

```
/ (homepage — audience fork)
/framework (The Asimov Framework overview)
/framework/claw-spec (The cLaw Specification v1.0.0)
/framework/agent-friday (Agent Friday — reference implementation)
/framework/certification (Asimov Agent Certification Program)
/framework/declaration (Declaration of Digital Independence)
/consulting (Enterprise AI consulting services)
/about (Stephen's bio + the Asimov tribute)
/writing (Blog/thought leadership — placeholder)
```

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript, managed by Vite.
- **Routing**: `wouter` for client-side navigation.
- **State Management**: TanStack React Query for server state caching.
- **Animations**: `framer-motion` for scroll-triggered fade-in animations.
- **UI Components**: Shadcn/ui (Radix UI primitives), lucide-react icons, react-icons for brand logos.
- **Styling**: Tailwind CSS with custom dark theme (navy/amber/cyan palette). Three font families: Inter (body), Space Grotesk (headings), Lora (serif, for Declaration page), JetBrains Mono (code).
- **Theme**: Dark-first design. CSS variables defined in `client/src/index.css` with navy backgrounds, amber primary, cyan accent.

### Key Frontend Components

- `components/Navigation.tsx` — Fixed top nav with Framework dropdown menu, mobile hamburger
- `components/Footer.tsx` — Three-column footer with nav, social links, legal info
- `components/PageLayout.tsx` — Wrapper with Navigation + Footer
- `components/StarField.tsx` — Canvas-based animated star field for hero sections
- `components/FadeIn.tsx` — Scroll-triggered fade-in animation wrapper using framer-motion
- `hooks/use-page-meta.ts` — Sets per-page title, description, and OG meta tags

### Pages

- `pages/home.tsx` — Hero with star field, two audience CTAs, three feature cards, credibility strip
- `pages/framework.tsx` — Three Laws showcase, ecosystem cards, "Why This Matters" prose
- `pages/agent-friday.tsx` — Product landing: differentiators, capability grid, open source ecosystem
- `pages/consulting.tsx` — Enterprise services, results stats, SAGE case study, contact form
- `pages/about.tsx` — Bio timeline, photo, citations, Asimov tribute
- `pages/claw-spec.tsx` — Full specification document with sticky sidebar ToC, scrollspy
- `pages/certification.tsx` — Three tiers, process timeline, FAQ accordion, inquiry form
- `pages/declaration.tsx` — Serif-styled declaration text, signature form with API submission
- `pages/writing.tsx` — Placeholder with article previews

### Backend Architecture

- **Framework**: Express 5 with TypeScript.
- **Data Storage**: PostgreSQL managed by Drizzle ORM.
- **API Routes** (`server/routes.ts`):
  - `GET /api/config` — Site configuration
  - `GET /api/signatories` — List declaration signatories with count
  - `POST /api/signatories` — Add a signatory
  - `POST /api/certification-inquiry` — Submit certification inquiry (sends email via Resend)

### Data Schema (`shared/schema.ts`)

- `site_config` — Basic site title config
- `signatories` — Declaration of Digital Independence signatories (name, organization, title, signedAt)
- `certification_inquiries` — Certification program inquiries (name, email, org, githubRepo, certificationLevel, message)

### Integrations

- **Stripe** (Replit connector) — Installed but not actively used for invoicing (invoicing removed)
- **Resend** (Replit connector) — Sends certification inquiry notification emails

### Development & Production

- **Dev**: `npm run dev` → tsx server + Vite HMR
- **Prod**: esbuild server bundle + Vite client build, static from `dist/public/`

## External Dependencies

### Core Runtime
- `express` v5, `drizzle-orm` + `pg`, `zod` + `drizzle-zod`

### Frontend Libraries
- `react` + `react-dom`, `wouter`, `@tanstack/react-query`, `framer-motion`
- `@radix-ui/*` (shadcn/ui), `lucide-react`, `react-icons`
- `tailwind-merge`, `clsx`, `class-variance-authority`

### Build & Dev Tools
- `vite`, `tsx`, `esbuild`, `drizzle-kit`, `tailwindcss`, `postcss`
