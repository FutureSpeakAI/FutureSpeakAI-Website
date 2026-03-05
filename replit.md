# replit.md

## Overview

This project is the **FutureSpeak.AI** marketing and consulting website, a minimalist, content-focused web presence for an enterprise AI strategy firm. It showcases services like agentic workflow design, RAG-based architectures, and AI transformation for Fortune 500 companies, founded by Stephen C. Webster.

The application is a full-stack TypeScript project using React for the frontend and Express for the backend. It features six static content pages, a comprehensive invoicing and payment system, and **Agent Friday** — an AI voice agent powered by Google Gemini 2.5 Flash Native Audio that serves as an interactive site guide.

### Key Capabilities

- **Agent Friday Voice Agent**: Real-time voice conversations via Gemini Live API WebSocket. 11 feature tiers including cinematic spotlighting, floating annotations, interactive demos, persona adaptation, guided decision flows, booking integration, scroll dwell detection, and multi-user awareness. See `AGENT_FRIDAY_VOICE.md` for full documentation.
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

-   **Primary UI**: `client/index.html` — a self-contained 6500-line static HTML single-page app with inline CSS, JS, and Three.js animations. This is the production site. Vite serves it in development via `server/vite.ts` (using `transformIndexHtml`). The React SPA in `client/src/` is unused scaffolding from the project template.
-   **Routing**: SPA navigation via `navigate(pageId)` function that toggles `.page-section.active` classes. Pages: `home`, `friday`, `declaration`, `claw-spec`, `certification`, `about`.
-   **Styling**: Tailwind CSS via CDN (`cdn.tailwindcss.com`), Inter and Fira Code fonts, custom CSS variables for navy/cyan/purple theme.
-   **3D Visuals**: Three.js (CDN import map) for background particle lattice and interactive cube animations.
-   **SEO**: Static meta tags, structured data (ProfessionalService, SoftwareApplication, WebSite, BreadcrumbList, Person), OG tags, Twitter cards.
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
-   **Voice Agent (Friday)**: Gemini 2.5 Flash native audio voice agent via `@google/genai` SDK LiveSession (`server/gemini-live.ts`), model `gemini-2.5-flash-native-audio-preview-12-2025`. Uses official SDK methods (`sendRealtimeInput` for audio, `sendClientContent` for text, `sendToolResponse` for function responses) instead of raw WebSocket — SDK handles API version, message format, and audio encoding automatically. Features: Kore voice, single-phase connection (greeting via `sendClientContent` on setup, then same session stays open for bidirectional audio), automatic VAD (no manual activity signals), function calling for name capture (`saveUserName`), returning-user recognition (`confirmReturningUser`), email signup (`showEmailSignupPopup`, `saveEmailSubscriber`), site-spanning guide functions (`navigateToPage`, `scrollToSection`, `highlightContent`, `scrollToContact`, `cinematicSpotlight`, `dismissCinematic`, `showAnnotation`, `dismissAnnotations`, `triggerInteractiveDemo`, `dismissDemo`, `adaptSitePersona`, `startGuidedFlow`, `updateGuidedFlow`, `completeGuidedFlow`, `openBookingWidget`, `getVisitorInsight`), cross-session memory via `voice_sessions` DB table, page-aware context (sends `page_change` events on navigation), session persistence via localStorage, auto-reconnect with exponential backoff (server: max 3 retries, client: max 5 retries), text message queuing (`_pendingTextMessages`) to avoid disrupting active model speech, AudioWorklet-based PCM capture/playback at 16kHz in / 24kHz out, scroll dwell tracking per section, ambient orb presence indicator, and live visitor count broadcast.
    -   **Advanced Gemini Live Features**: `inputAudioTranscription` and `outputAudioTranscription` (real-time speech-to-text for both user and model, forwarded to client as `transcript` messages and displayed in voice overlay), `enableAffectiveDialog` (tone-aware responses), `realtimeInputConfig` with `AutomaticActivityDetection` (high start sensitivity, low end sensitivity, 100ms prefix padding, 500ms silence duration) and `ActivityHandling.START_OF_ACTIVITY_INTERRUPTS` (barge-in support), `proactivity` (model can choose not to respond to irrelevant input), `contextWindowCompression` with `SlidingWindow` (triggers at 25k tokens, compresses to 12.5k for long sessions), `sessionResumption` with transparent reconnection (handle stored on `_sessionResumptionHandle`, reused on reconnect). Viewport context tracking sends visible section names to Gemini every 3s when content changes.
    -   **Page ID Mapping**: Server uses `claw`/`leadership` keys; client HTML uses `claw-spec`/`about` IDs. Mapping handled bidirectionally in `getCurrentPage()` and `navigate_to_page` handler.
    -   **Site Guide (11 Tiers)**: Navigation, section scrolling, content highlighting (`.friday-highlight`), cinematic spotlight mode (page dims with dramatic section spotlight), floating annotations (positioned margin notes), interactive demos (proof-of-integrity, federation-handshake, onboarding-preview), persona adaptation (developer/executive/researcher), guided decision flows (consulting intake), inline booking widget, visitor insight analytics, and ambient orb presence.
    -   **Two-Tier AI Button System**: Top-of-page navbar buttons ("Have Your AI Explain" / "Have Agent Friday Explain") persist site-wide; contextual bottom-of-page buttons ("Ask Your AI To Explain This Page" / "Ask Agent Friday To Explain This Page") placed after major content sections on Consulting, Agent Friday, Declaration, Certification, cLaw Spec, and Leadership pages with page-specific prompts. No duplicate buttons — each page has only the navbar set and the lower contextual set.
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
-   **Model**: `gemini-2.5-flash-native-audio-preview-12-2025` (via `@google/genai` SDK LiveSession, `v1alpha` API)
-   **Voice**: Kore (warm American female)
-   **SDK**: `@google/genai` — handles WebSocket connection, message format, audio encoding. Do NOT use raw WebSocket.

### Contextual Button Styling
-   Page-level AI buttons use `.ctx-action-bar` CSS class — a frosted glass bar with gradient accent, "Explore" label, dividers, PromptPush widget, and voice button integrated inline.