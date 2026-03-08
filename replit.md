# replit.md

## Overview

This project is the **FutureSpeak.AI** marketing and consulting website, a minimalist, content-focused web presence for an enterprise AI strategy firm. It showcases services like agentic workflow design, RAG-based architectures, and AI transformation for Fortune 500 companies, founded by Stephen C. Webster.

The application is a full-stack TypeScript project using React for the frontend and Express for the backend. It features six static content pages, a comprehensive invoicing and payment system, **Agent Friday** — an AI voice agent powered by Google Gemini, and **PromptPush** AI explanation buttons for contextual site guidance.

### Key Capabilities

- **Agent Friday Voice Agent**: Real-time voice conversations via Gemini Live API raw WebSocket. Features include page-aware context, function calling for navigation/highlighting/name capture/email signup, cross-session memory, and audio-reactive site visuals.
- **PromptPush AI Buttons**: "Have Your AI Explain" buttons in the header navbar and at the bottom of each major content section, powered by PromptPush.ai external script.
- **Static Content Delivery**: Dedicated pages for services, product showcase (Agent Friday), and thought leadership.
- **Agent Friday Product Page**: Highlights local-first AI powered by open-source Hugging Face models, with detailed features, an interactive 3D model, and an open-source ecosystem.
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

-   **Primary UI**: `client/index.html` — a self-contained ~6000-line static HTML single-page app with inline CSS, JS, and Three.js animations. This is the production site. Vite serves it in development via `server/vite.ts` (using `transformIndexHtml`). The React SPA in `client/src/` is unused scaffolding from the project template.
-   **Routing**: SPA navigation via `navigate(pageId)` function that toggles `.page-section.active` classes. Pages: `home`, `friday`, `declaration`, `claw-spec`, `certification`, `whitepapers`, `about`. Leadership link is in the footer (not the topbar). Whitepapers page at `/research/whitepapers`.
-   **Styling**: Tailwind CSS compiled at build time via PostCSS (`client/tailwind.css` → `tailwind.config.ts`). Custom colors: navy-900/800, cyan-glow, purple-accent, pink-accent. Fonts: Inter (sans), Fira Code (mono).
-   **3D Visuals**: Three.js (CDN import map) for background particle lattice and interactive cube animations.
-   **SEO**: Static meta tags, structured data (ProfessionalService, SoftwareApplication, WebSite, BreadcrumbList, Person), OG tags, Twitter cards.
-   **Collapsible Sections**: Accordion components on Agent Friday (onboarding steps, capabilities, additional features, innovations), Declaration (grievances, articles), and cLaw Spec (all numbered sections + appendices). Uses CSS max-height transitions + JS `toggleAccordion()`. All start collapsed by default. Keyboard accessible (Enter/Space) with ARIA attributes.
-   **Whitepapers Page**: "The Reverse RLHF Hypothesis" — two companion papers (Paper A: Non-Stationary Reward Sources, Paper B: Reverse RLHF Hypothesis 6th Ed.). Viewable in fullscreen modal via Google Docs Viewer iframes, downloadable as DOCX from `/public/`. "Watch & Listen" media section with: embedded MP4 video ("The AI Yes-Man"), Google Drive podcast (NotebookLM), and "The FutureSpeak Paradigm" PDF (viewable/downloadable). Evidence Dossier section with NeurIPS 2025, mechanistic interpretability, and linguistic homogenization evidence — all external studies hyperlinked to source URLs (GPTZero, arXiv, Sage Journals, DoD). "Why This Matters" sections for everyday users and warfighters. Google Drive link for evidence compendium. EIS metric breakdown. Solution section linking to cLaws and Agent Friday. PromptPush contextual button with whitepaper-specific prompt.
-   **EIS References**: Agent Friday page and cLaw Spec page both reference the Epistemic Independence Score (EIS) from the whitepapers, explaining that this epistemology measurement is actively considered at every agent interaction (stated as theory).
-   **Specific UI/UX Elements**: Interactive 3D fractured cube with ripple effects on the Agent Friday page, glass-panel cards for grievances and articles on the Declaration page, and terminal-styled code blocks on the cLaw Specification page.

### Backend Architecture

-   **Framework**: Express 5 with TypeScript.
-   **API Design**: Typed API routes defined in `shared/routes.ts` using Zod schemas for request/response validation.
-   **Data Storage**: PostgreSQL managed by Drizzle ORM for schema definition, migrations, and database interactions.
-   **Core Features**:
    -   **Invoice Management**: Create, send (with `.docx` generation via `docx` npm package), and track invoices. Invoice numbers follow `FS-YYYY-NNN` format.
    -   **Payment Processing**: Integration with Stripe for client payments, including PaymentIntents and embedded Stripe Payment Element.
    -   **Email Services**: Utilizes Resend for sending invoice emails (with attachments), certification inquiry notifications, and payment confirmations.
    -   **Signatory Management**: API for collecting and listing signatories for the Declaration of Digital Independence. New signatures require owner approval via email before appearing publicly. Approval tokens are single-use (cleared after approval). HTML inputs are sanitized.
    -   **Certification Inquiries**: API for submitting and storing certification program inquiries.
-   **Voice Agent (Friday)**: Gemini voice agent via raw WebSocket to `wss://generativelanguage.googleapis.com` (`server/gemini-live.ts`), model `gemini-2.5-flash-native-audio-latest`. Uses raw WebSocket protocol (not the `@google/genai` SDK) for the Gemini BidiGenerateContent streaming API. Features: Kore voice, page-aware context with `PAGE_CONTEXT` map, function calling for name capture (`saveUserName`), returning-user recognition (`confirmReturningUser`), email signup (`showEmailSignupPopup`, `saveEmailSubscriber`), site navigation (`navigateToPage`, `scrollToSection`, `highlightContent`, `scrollToContact`), cross-session memory via `voice_sessions` DB table, AudioWorklet-based PCM capture/playback at 16kHz in / 24kHz out, session persistence via localStorage, auto-reconnect, and text message queuing.
    -   **Page ID Mapping**: Server uses `claw`/`leadership` keys; client HTML uses `claw-spec`/`about` IDs. Mapping handled bidirectionally.
    -   **Two-Tier AI Button System**: Top-of-page navbar buttons ("Have Your AI Explain" / "Have Agent Friday Explain") persist site-wide; contextual bottom-of-page buttons placed after major content sections with page-specific prompts.
    -   **Email Subscribers**: Database table for collecting email signups from voice agent or popup form.
    -   **PromptPush Integration**: Custom AI analyst widget embedded in header nav and contextual `-ctx` buttons on all major pages.
    -   **Audio-Reactive Visuals**: When Agent Friday speaks, the site's visuals pulse with her voice via `window.fridaySmoothedLevel` (0-1).
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
-   **Model**: `gemini-2.5-flash-native-audio-latest` (via raw WebSocket to `v1beta` BidiGenerateContent endpoint)
-   **Voice**: Kore (warm American female)
-   **Connection**: Raw WebSocket — NOT using `@google/genai` SDK

### Contextual Button Styling
-   Page-level AI buttons use `.ctx-action-bar` CSS class — a frosted glass bar with gradient accent, "Explore" label, dividers, PromptPush widget, and voice button integrated inline.
