# replit.md

## Overview

This project is the **FutureSpeak.AI** marketing and consulting website, a minimalist, content-focused web presence for an enterprise AI strategy firm. It showcases services like agentic workflow design, RAG-based architectures, and AI transformation for Fortune 500 companies, founded by Stephen C. Webster.

The application is a full-stack TypeScript project using React for the frontend and Express for the backend. It features six static content pages and a minimal backend that serves site configuration from a PostgreSQL database. The site also includes a comprehensive invoicing and payment system for clients, dynamic forms (e.g., Declaration of Digital Independence signatories, Certification Program inquiries), and advanced SEO optimization. Key capabilities include:

- **Static Content Delivery**: Dedicated pages for services, product showcase (Agent Friday), and thought leadership.
- **Agent Friday Product Page**: Highlights "The World's First AGI OS" with detailed features, an interactive 3D model, and an open-source ecosystem.
- **Declaration of Digital Independence**: A manifesto page with a live signatory form.
- **cLaw Specification**: A formal technical standard for AI agent governance.
- **Asimov Agent Certification Program**: Details certification levels, process, and includes an inquiry form.
- **Admin Invoicing and Payments**: A password-protected system for creating, sending, and tracking invoices, integrated with Stripe for client payments.
- **Comprehensive SEO**: Dynamic metadata, structured data, and resource hints for optimal search engine visibility.

The primary purpose is to serve as a polished, animated marketing site with server-side configuration support, a clean design system, and a complete invoicing/payment system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

-   **Framework**: React 18 with TypeScript, managed by Vite.
-   **Routing**: `wouter` for client-side navigation, supporting `history.pushState` for real URLs and `popstate` for browser history.
-   **State Management**: TanStack React Query for server state caching.
-   **Animations**: `framer-motion` for subtle UI animations.
-   **UI/UX**: Minimalist design with light/dark mode support via CSS variables, based on shadcn/ui (New York style) utilizing Radix UI primitives. Styling is managed with Tailwind CSS, Inter and JetBrains Mono fonts.
-   **SEO**: Dynamic per-page titles, meta descriptions, canonical URLs, OG tags, Twitter cards, structured data (ProfessionalService, SoftwareApplication, WebSite, BreadcrumbList, Person), `robots.txt`, and `sitemap.xml`.
-   **Specific UI/UX Elements**: Interactive 3D fractured cube with ripple effects on the Agent Friday page, glass-panel cards for grievances and articles on the Declaration page, and terminal-styled code blocks on the cLaw Specification page.

### Backend Architecture

-   **Framework**: Express 5 with TypeScript.
-   **API Design**: Typed API routes defined in `shared/routes.ts` using Zod schemas for request/response validation.
-   **Data Storage**: PostgreSQL managed by Drizzle ORM for schema definition, migrations, and database interactions.
-   **Core Features**:
    -   **Invoice Management**: Create, send (with `.docx` generation via `docx` npm package), and track invoices. Invoice numbers follow `FS-YYYY-NNN` format.
    -   **Payment Processing**: Integration with Stripe for client payments, including PaymentIntents and embedded Stripe Payment Element.
    -   **Email Services**: Utilizes Resend for sending invoice emails (with attachments), certification inquiry notifications, and payment confirmations.
    -   **Signatory Management**: API for collecting and listing signatories for the Declaration of Digital Independence.
    -   **Certification Inquiries**: API for submitting and storing certification program inquiries.
-   **Voice Agent (Friday)**: Gemini 2.5 Flash native audio voice agent via WebSocket proxy (`server/gemini-live.ts`). Features: Kore voice, function calling for name capture (`saveUserName`), returning-user recognition (`confirmReturningUser`), email signup (`showEmailSignupPopup`, `saveEmailSubscriber`), cross-session memory via `voice_sessions` DB table, page-aware context (sends `page_change` events on navigation), session persistence via localStorage, auto-reconnect, and AudioWorklet-based PCM capture/playback.
    -   **Two-Tier AI Button System**: Generic top-of-page buttons ("Ask Your AI: What Is This?" / microphone icon) persist site-wide; contextual mid-page buttons ("Ask Your AI About This Page" / "Ask Friday About This Page") on Consulting, Agent Friday, Declaration, Certification, cLaw Spec, and Leadership pages with page-specific prompts.
    -   **Email Subscribers**: Database table for collecting email signups from voice agent or popup form.
    -   **PromptPush Integration**: Custom AI analyst widget embedded in header nav and contextual `-ctx` buttons on all major pages.
    -   **Page Context Map**: Server maintains `PAGE_CONTEXT` with talking points for each page; Gemini receives page-aware system instructions and mid-session navigation updates.
    -   **Audio-Reactive Visuals**: When Agent Friday speaks, the site's visuals pulse with her voice. The playback audio path includes an AnalyserNode that exposes `window.fridaySmoothedLevel` (0-1). The background lattice responds with particle size growth, orbit expansion, white color blend, brighter connections, and bloom intensity. The cube of cubes responds with slow scale breathing, rotational sway, edge glow, connection brightness, and light intensity. RAF loop auto-stops when audio fades. Text readability preserved via `content-backdrop` with `backdrop-filter: blur(2px)`.
-   **Authentication**: Admin routes are password-protected via an `x-admin-password` header checked against a `SESSION_SECRET` environment variable.

### Data Storage

-   **Database**: PostgreSQL.
-   **ORM**: Drizzle ORM with `drizzle-kit` for migrations.
-   **Schema**: Key tables include `site_config`, `signatories`, `certification_inquiries`, `invoices`, and `invoice_counter`. All financial amounts are stored in cents, and tax rates in basis points.

### Development & Production Workflow

-   **Development**: `tsx` for backend, Vite for frontend with HMR.
-   **Production**: `esbuild` for server bundling, Vite for client build, serving static files from `dist/public/`.

## External Dependencies

### Core Runtime

-   `express` v5: HTTP server framework.
-   `drizzle-orm` + `pg`: PostgreSQL ORM and driver.
-   `zod` + `drizzle-zod`: Schema validation and auto-generation from Drizzle tables.
-   `docx`: Server-side `.docx` invoice generation.
-   `stripe`: Stripe API client for payment processing.

### Frontend Libraries

-   `react` + `react-dom`: UI framework.
-   `wouter`: Lightweight client-side router.
-   `@tanstack/react-query`: Server state management and caching.
-   `framer-motion`: Animation library.
-   `@radix-ui/*`: Headless accessible UI primitives (used by shadcn/ui).
-   `tailwind-merge`, `clsx`, `class-variance-authority`: Styling utilities.
-   `lucide-react`: Icon set.

### Build & Dev Tools

-   `vite` + `@vitejs/plugin-react`: Frontend bundler and dev server.
-   `tsx`: TypeScript runner for development.
-   `esbuild`: Server bundler for production.
-   `drizzle-kit`: DB schema migrations.
-   `tailwindcss`, `postcss`, `autoprefixer`: CSS processing.

### Integrations

-   **Stripe (Replit connector)**: For payment processing (PaymentIntents, Stripe Elements).
-   **Resend (Replit connector)**: For email delivery (invoices, inquiries, payment confirmations).
-   `stripe-replit-sync`: Automatic Stripe schema migrations and webhook management.

### Environment Variables

-   `DATABASE_URL`: PostgreSQL connection string.
-   `SESSION_SECRET`: Admin password for invoice management.
-   `REPLIT_DOMAINS`: Used for webhook URL and payment link generation.
-   `GEMINI_API_KEY`: Google Gemini API key for Friday voice agent.

### Voice Model
-   **Model**: `models/gemini-2.5-flash-native-audio-latest` (Gemini Live bidiGenerateContent API)
-   **Voice**: Kore (warm American female)

### Contextual Button Styling
-   Page-level AI buttons use `.ctx-action-bar` CSS class — a frosted glass bar with gradient accent, "Explore" label, dividers, PromptPush widget, and voice button integrated inline.