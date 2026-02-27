# replit.md

## Overview

This is a **FutureSpeak.AI** marketing/consulting website — a minimalist, content-focused web presence for an enterprise AI strategy and consulting firm founded by Stephen C. Webster. The site showcases services around agentic workflow design, RAG-based architectures, and AI transformation for Fortune 500 companies.

The application is a full-stack TypeScript project with a React frontend and Express backend. It has three pages (Home, Agent Friday, and About) and a minimal backend that serves a single site configuration record from a PostgreSQL database. The architecture is intentionally simple — it's a landing site, not a complex application.

**URL Routing**: The site uses SPA-style navigation with `history.pushState` for real URLs:
- `/` — Home (Capabilities)
- `/software` — Agent Friday product page (nav label: "Software")
- `/leadership` — Stephen C. Webster bio (nav label: "Leadership")
- `/friday` and `/about` are kept as aliases that redirect to the new canonical paths
All nav links use `data-nav` attributes intercepted by a delegated click handler. Browser back/forward is supported via `popstate`. The server (vite.ts) serves `index.html` for all routes (catch-all), and the JS detects the URL path on load to show the correct page section.

**SEO**: Full optimization including:
- Dynamic per-page title, meta description, canonical URL, OG tags, and Twitter cards
- Twitter `@futurespeakai` site/creator handles
- Structured data: ProfessionalService, SoftwareApplication (Agent Friday), WebSite, BreadcrumbList, Person (Stephen C. Webster)
- `robots.txt` and `sitemap.xml` in `client/public/`
- Resource hints (`preconnect`, `dns-prefetch`) for Google Fonts, Tailwind CDN, jsDelivr
- `<noscript>` fallback with key content for crawlers without JS
- Enhanced robots meta with `max-image-preview:large`, `max-snippet:-1`
- `og:image:alt` and `twitter:image:alt` tags

The **Agent Friday page** (`/software`) is the product showcase, positioned as "The World's First AGI OS — An Asimov Agent." Narrative-first layout:
1. **Hero** — AGI OS positioning ("An operating system with a heart") — emphasizes voice-first AI chief of staff, Relationship Intelligence, 200+ models. Download CTA links to GitHub Releases; Source Code links to repo. Emoji branding: 🌠 (shooting star) + 🔭 (telescope) — Friday's brand identity.
2. **Teaser Video** — YouTube embed (youtube-nocookie.com/embed/26kKJB7gMCI) between hero and experience
3. **The Experience** — Her-inspired onboarding walkthrough (8 steps, 12-step guided onboarding, 30-voice audition, 7 API key services)
4. **Four Pillars** — "An OS With Principles" (Asimov's cLaws), "An OS That Understands Your World" (Relationship Graph), Security (OpenClaw reimagining), Evolving Interface
5. **Asimov's cLaws** — Consent gates, Trust Architecture, Interruptibility Guarantee, Personality Integrity System
6. **What Happens When Everyone Has One** — Privacy architecture vision section with 5 cards: encrypted data/comms, code contribution via GitLoader, structural impossibility of mass data collection, ethical enforcement online, "crypto wrapper for electronic thought" (agent-to-agent encrypted communication)
7. **Capabilities** — 8 cards: voice, vision + SOC, parallel agents (5 concurrent + Agent Office), memory, coding (18+ connectors), Relationship Intelligence (Relationship Graph), Communications Intelligence (context-aware drafting), meetings (context-rich)
7. **Additional Capabilities** — 15 cards including PageIndex, GitLoader, SOC, Context-Rich Meeting Prep, Predictive Intelligence, Agent Office, Superpowers Registry, Project Awareness
8. **Ideas That Don't Exist Anywhere Else** — 10 innovation cards: Hermeneutic Re-evaluation, Personality → Visual Expression, The Silence Is the Signal (mother question), 8-Layer Dynamic Personality, Morality as Cryptography, Memory Consolidation (6-hour sleep cycle), Trust → Action Pipeline, Vectorless RAG (PageIndex), Embodied Agency (Agent Office), Beyond OpenClaw
9. **Under the Hood** — Model Orchestra (8 providers with Nano Banana 2 image gen, DALL-E 3 fallback), World Monitor (17 domains), Privacy/Security (15 bullets including Relationship Graph integrity + local-only), Tech Stack (15 entries including Relationship Intelligence row)
10. **Open Source Ecosystem** — 8 standalone libraries (trust-graph-engine, cognitive-memory, agent-integrity, personality-evolution, predictive-agent, self-improving-agent, meeting-intelligence, GitNexus) + 7 customized forks (World Monitor, PageIndex, Pixel Agents, OpenClaw, SOC, Browser Use, Frontend Slides). Links to github.com/FutureSpeakAI org.
11. **CTA** — "🌠 Meet Your Friday 🔭" linking to GitHub

The page includes an interactive 3D fractured cube (Three.js) with click-to-ripple effects, connection lines between pieces, and mouse-reactive individual pieces.

**Key purpose:** Serve a polished, animated marketing site with server-side configuration support and a clean design system.

---

## User Preferences

Preferred communication style: Simple, everyday language.

---

## System Architecture

### Frontend Architecture

- **Framework:** React 18 with TypeScript, bootstrapped via Vite
- **Routing:** `wouter` — a lightweight client-side router (two routes: `/` and `/about`)
- **State/Data Fetching:** TanStack React Query (`@tanstack/react-query`) for server state; the `useConfig` hook fetches site config from `/api/config` with `staleTime: Infinity` since config rarely changes
- **Animations:** `framer-motion` for subtle page-load stagger animations (opacity + Y-axis fade-in)
- **UI Component Library:** shadcn/ui (New York style) — a full suite of Radix UI-based components is present, though only a subset is actively used on the current pages
- **Styling:** Tailwind CSS with CSS custom properties for theming; Inter (sans) and JetBrains Mono (code) fonts from Google Fonts
- **Design system:** Minimalist — light/dark mode via CSS variables, neutral base color, emphasis on whitespace and typography
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture

- **Framework:** Express 5 with TypeScript, running via `tsx` in development
- **Entry point:** `server/index.ts` creates an HTTP server, registers routes, and serves static files or proxies Vite in development
- **Route structure:** Minimal — only one API route (`GET /api/config`) defined in `server/routes.ts`
- **Storage layer:** `server/storage.ts` defines a `DatabaseStorage` class implementing `IStorage` interface, keeping DB logic separate from route handlers
- **Type sharing:** `shared/routes.ts` exports a typed `api` object with paths and Zod response schemas — used by both client hooks and server route definitions
- **Build:** Production build uses esbuild for the server (bundling an allowlist of critical deps) and Vite for the client; output goes to `dist/`

### Data Storage

- **Database:** PostgreSQL via `drizzle-orm/node-postgres`
- **ORM:** Drizzle ORM with `drizzle-kit` for migrations (`./migrations/`) and schema pushes
- **Schema:** Single table — `site_config` with `id` (serial PK) and `title` (text). Defined in `shared/schema.ts` so types are shared between frontend and backend
- **Validation:** `drizzle-zod` auto-generates insert schemas from the Drizzle table definition
- **Connection:** Pool-based via `pg.Pool`, connection string from `DATABASE_URL` environment variable

### Routing / API Design

- API routes are typed in `shared/routes.ts` using a structured `api` object with method, path, and Zod response schemas
- The frontend references `api.config.get.path` directly — no magic strings
- `buildUrl()` helper in shared routes handles parameterized path replacement

### Development vs Production

- **Dev:** `tsx server/index.ts` starts Express; Vite runs as middleware (`server/vite.ts`) with HMR via WebSocket
- **Production:** Vite builds client to `dist/public/`; esbuild bundles server to `dist/index.cjs`; Express serves static files from `dist/public/`

---

## External Dependencies

### Core Runtime
| Package | Purpose |
|---|---|
| `express` v5 | HTTP server framework |
| `drizzle-orm` + `pg` | PostgreSQL ORM and driver |
| `drizzle-zod` | Auto-generate Zod schemas from Drizzle tables |
| `zod` | Schema validation (shared between client and server) |

### Frontend
| Package | Purpose |
|---|---|
| `react` + `react-dom` | UI framework |
| `wouter` | Lightweight client-side router |
| `@tanstack/react-query` | Server state management and caching |
| `framer-motion` | Animation library (stagger fade-in effects) |
| `@radix-ui/*` | Headless accessible UI primitives (full shadcn/ui suite) |
| `class-variance-authority` + `clsx` + `tailwind-merge` | Utility-first styling helpers |
| `lucide-react` | Icon set |
| `recharts` | Chart components (available but not currently used) |
| `embla-carousel-react` | Carousel (available but not currently used) |

### Build & Dev Tools
| Package | Purpose |
|---|---|
| `vite` + `@vitejs/plugin-react` | Frontend bundler and dev server |
| `tsx` | TypeScript runner for server in development |
| `esbuild` | Server bundler for production |
| `drizzle-kit` | DB schema migrations and push |
| `@replit/vite-plugin-runtime-error-modal` | Replit-specific dev overlay |
| `@replit/vite-plugin-cartographer` | Replit-specific dev tooling |
| `tailwindcss` + `postcss` + `autoprefixer` | CSS processing pipeline |

### Session / Auth (present in build allowlist, not yet wired up)
- `express-session`, `connect-pg-simple`, `passport`, `passport-local` — infrastructure is in the build allowlist but no auth routes are implemented yet
- `jsonwebtoken`, `memorystore` — also available but unused

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string (required at startup; throws if missing)