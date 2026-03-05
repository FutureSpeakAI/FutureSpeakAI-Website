# Agent Friday — Voice Agent Architecture & Feature Reference

## Overview

Agent Friday is an AI voice agent embedded in the FutureSpeak.AI website. She uses Google's Gemini 2.5 Flash Native Audio model via the Live API (WebSocket) to conduct real-time voice conversations with site visitors. She can navigate, annotate, spotlight, and reshape the website in response to conversational context — making her not just a chatbot but an interactive site guide.

## Architecture

```
┌─────────────┐     WebSocket      ┌──────────────┐     WebSocket      ┌──────────────┐
│   Browser    │ ←────────────────→ │  Express     │ ←────────────────→ │  Gemini Live │
│  (Client)    │   /ws/voice        │  Server      │   BidiGenerate     │  API         │
│              │                    │              │   Content           │              │
│  - Mic PCM   │  audio chunks →   │  - Session   │  realtimeInput →  │  - VAD       │
│  - Playback  │  ← audio data     │    manager   │  ← serverContent   │  - Native    │
│  - UI FX     │  ← commands       │  - Tool      │  ← toolCall        │    Audio     │
│  - Dwell     │  dwell data →     │    handlers  │  toolResponse →    │  - Functions │
│    tracking  │                    │  - State     │                    │              │
└─────────────┘                    └──────────────┘                    └──────────────┘
```

### Data Flow

1. **Client → Server**: PCM audio (16kHz), page change events, dwell data, ping
2. **Server → Gemini**: `realtimeInput.audio` (PCM 16kHz), `clientContent` (text prompts), `toolResponse`
3. **Gemini → Server**: `serverContent` (audio + text), `toolCall` (function requests), transcriptions
4. **Server → Client**: Audio data (PCM 24kHz), UI commands (navigate, highlight, spotlight, etc.), status updates

### Key Files

| File | Purpose |
|------|---------|
| `server/gemini-live.ts` | WebSocket proxy, session management, Gemini integration, all tool handlers |
| `client/index.html` | Complete frontend — HTML structure, CSS styles, JavaScript voice agent |
| `server/storage.ts` | Database operations for session persistence and email subscribers |
| `shared/schema.ts` | Database schema (Drizzle ORM) |

## Bug Fixes (Critical)

### 1. Deprecated `mediaChunks` → `audio` field

The Gemini Live API deprecated `realtimeInput.mediaChunks`. Updated to use `realtimeInput.audio`:

```js
// Before (broken):
{ realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data }] } }

// After (correct):
{ realtimeInput: { audio: { mimeType: "audio/pcm;rate=16000", data } } }
```

This is the most likely fix for why Friday could greet (triggered by text clientContent) but never responded to speech (audio input was sent in a deprecated format the model may not process).

### 2. Setup Message Preserved

The setup message structure (model, generationConfig, systemInstruction, tools format) is kept byte-for-byte identical to the original working version. No `inputAudioTranscription`, `outputAudioTranscription`, or `realtimeInputConfig` were added — these caused setup rejection in prior attempts. The default automatic VAD works correctly.

### 3. Lean System Instruction

New tool capabilities are described in a single paragraph (4 lines) added to the existing system instruction. The function declarations themselves carry all the behavioral detail. Previous attempts with 95+ line instructions caused setup timeouts.

## Features

### Tier 1: Site Navigation (Pre-existing, enhanced)

| Function | Description | Server Handler | Client Handler |
|----------|-------------|---------------|----------------|
| `navigateToPage(pageId)` | Navigate to a site page | Updates session, relays to client | Calls `navigate()` with page ID mapping |
| `scrollToSection(sectionId)` | Scroll to a content section | Relays to client | `fridayScrollToSection()` — finds by ID, data-section, or class |
| `highlightContent(sectionId, durationMs)` | Temporary glow effect on a section | Relays with duration | `fridayHighlightSection()` — CSS `.friday-highlight` with glow animation |
| `scrollToContact()` | Scroll to contact/booking section | Relays to client | Calls `scrollToContact()` or scrolls to `#contact-section` |

### Tier 2: Cinematic Guided Tours

**Purpose**: Dramatic, museum-tour-style presentations where the page dims and a single section is spotlit.

| Function | Description |
|----------|-------------|
| `cinematicSpotlight(sectionId, narration?)` | Dims the page to 85% black, spotlights the target section with a dramatic glow, and optionally shows a narration label at the bottom of the screen |
| `dismissCinematic()` | Removes all cinematic effects, returns page to normal |

**How it works**: A full-page overlay (`#friday-cinematic-overlay`) fades to near-black. The target element gets class `.friday-cinematic-spotlight` which uses `box-shadow: 0 0 0 9999px` to create a cutout effect. An optional narration bar appears at the bottom.

**When Friday uses it**: When walking a first-time visitor through the Declaration of Digital Independence or the cLaw specification — sections that benefit from focused, dramatic presentation.

### Tier 3: Floating Annotations

**Purpose**: Temporary margin notes that appear alongside content, adding explanatory context as Friday narrates.

| Function | Description |
|----------|-------------|
| `showAnnotation(targetId, text, position?)` | Places a floating glass-panel note next to the target section. Position defaults to 'right'. |
| `dismissAnnotations()` | Removes all annotations |

**How it works**: Annotations are absolutely-positioned DOM elements created dynamically and placed relative to the target element's viewport position. They use a glass-morphism style with a cyan accent marker (✦).

**When Friday uses it**: When explaining technical concepts like Proof of Integrity — verbal explanation paired with visual notes that persist on screen.

### Tier 4: Interactive Demos

**Purpose**: Pre-built step-by-step visualizations that Friday can summon and narrate over.

| Function | Description |
|----------|-------------|
| `triggerInteractiveDemo(demoId)` | Opens a demo overlay with animated steps |
| `dismissDemo()` | Closes the demo |

**Available Demos**:

1. **`proof-of-integrity`** — Shows the 5-step cLaw verification flow: hash generation → on-chain storage → verification request → real-time comparison → attestation
2. **`federation-handshake`** — Agent-to-agent trust establishment: discovery → challenge → proof → mutual verification → encrypted channel
3. **`onboarding-preview`** — Agent Friday first launch: greeting → personality setup → psychological profile → integrations → awakening

**How it works**: Each demo is defined as a data structure in `DEMO_CONTENT`. Steps animate in sequentially with staggered delays. The overlay uses glass-morphism styling consistent with the site.

### Tier 5: Voice-Driven Site Persona

**Purpose**: Adapts the site's visual emphasis based on who Friday is talking to.

| Function | Description |
|----------|-------------|
| `adaptSitePersona(persona)` | Applies persona-specific CSS. Options: 'developer', 'executive', 'researcher', 'general' |

**Persona Effects**:

- **developer**: Technical sections glow (`.dev-emphasis` highlighted), business sections fade
- **executive**: Business/ROI sections glow (`.exec-emphasis` highlighted), technical sections fade
- **researcher**: Architecture/spec sections glow (`.research-emphasis` highlighted), business sections fade
- **general**: All effects removed, default layout

**How it works**: Adds `persona-{type}` class to `<body>`. CSS rules target elements with `.dev-emphasis`, `.exec-emphasis`, `.research-emphasis` classes, adjusting border glow and opacity.

### Tier 6: Guided Decision Flows

**Purpose**: Structured conversational intake that turns Friday into a qualification engine.

| Function | Description |
|----------|-------------|
| `startGuidedFlow(flowId)` | Opens a flow card UI and begins the intake process |
| `updateGuidedFlow(stepLabel, answer)` | Records an answer and advances the visual card |
| `completeGuidedFlow(summary, recommendedServices)` | Shows a recommendation card with service tags |

**Flow: `consulting-intake`**

Friday walks the visitor through: Industry → Team Size → AI Maturity → Pain Points → Goals. Each answer appears on the flow card in real time. On completion, a recommendation summary with service tags is displayed.

**How it works**: A fixed-position card (`#friday-flow-card`) slides in from the bottom-right. Answers accumulate as labeled rows. The completion state shows a summary with clickable service tags.

### Tier 7: Calendar Booking

**Purpose**: Inline consultation scheduling without leaving the conversation.

| Function | Description |
|----------|-------------|
| `openBookingWidget()` | Opens an inline calendar overlay with available time slots |

**How it works**: Generates sample time slots for the upcoming week. User clicks a slot, confirms, and gets a visual booking confirmation. The overlay uses the same glass-morphism styling.

**Note**: Currently generates placeholder slots. For production, integrate with Google Calendar API via the MCP server connection.

### Tier 8: Visitor Intelligence

**Purpose**: Gives Friday awareness of the visitor's behavior and the site's live activity.

| Function | Description |
|----------|-------------|
| `getVisitorInsight()` | Returns dwell time data, pages visited, exchange count, and active visitor count |

**Data returned**:
```json
{
  "totalActiveVisitors": 3,
  "visitorsPerPage": { "home": 1, "friday": 1, "declaration": 1 },
  "userDwellTime": "services: 45s, declaration-hero: 32s",
  "pagesVisited": ["home", "friday"],
  "currentPage": "friday",
  "exchangeCount": 7
}
```

**When Friday uses it**: "I notice you've been spending time on the services section — would you like me to walk you through what we offer?" or "There are a few other people exploring the site right now, actually."

### Tier 9: Ambient Presence

**Purpose**: A persistent visual indicator that Friday is present and active.

**Implementation**: A floating orb (`#friday-ambient-orb`) in the bottom-right corner that:
- Appears when voice is active
- Pulses gently when listening (purple animation)
- Glows intensely when speaking (cyan animation)
- Has a ring pulse animation for ambient presence
- Disappears when voice is disconnected

**No function call needed** — this is driven automatically by the client's status state.

### Tier 10: Scroll Dwell Detection

**Purpose**: Tracks how long a visitor lingers on each content section, enabling proactive engagement.

**Implementation**: An `IntersectionObserver` monitors all content sections (excluding UI elements). When a section enters the viewport, a timer starts. When it leaves, the elapsed time is sent to the server via `dwell_update` messages. The server accumulates this data in the session's `dwellSections` map.

**Friday accesses this via `getVisitorInsight()`** to make observations like "You've been reading about the Declaration for a while — want me to highlight the key grievances?"

### Tier 11: Multi-User Awareness

**Purpose**: Subtle indication that the site is alive with other visitors.

**Implementation**: The server counts active WebSocket connections and broadcasts the count every 15 seconds. When count > 1, a small indicator appears in the top-right: "3 explorers online".

**How it works**: `getActiveVisitorCount()` iterates over active sessions. The count is broadcast via `visitor_count` messages. The client updates `#friday-visitor-count`.

## Session Lifecycle

```
1. User clicks "Talk to Agent Friday"
2. Client: getUserMedia() → AudioWorklet captures PCM at 16kHz
3. Client: Opens WebSocket to /ws/voice with sessionId, userName, page
4. Server: Creates/retrieves VoiceSession, connects to Gemini WebSocket
5. Server → Gemini: Sends setup message (model, config, system instruction, tools)
6. Gemini → Server: setupComplete
7. Server → Gemini: Sends greeting clientContent (audio forwarding paused)
8. Gemini → Server → Client: Greeting audio streams
9. Gemini → Server: turnComplete → Audio forwarding enabled
10. Client: Mic audio → Server → Gemini (continuous stream)
11. Gemini: VAD detects speech → generates response → streams audio back
12. [Loop: conversation continues with tool calls, page changes, etc.]
13. User closes overlay → Client closes WebSocket → Server cleans up
```

## Audio Pipeline

- **Input**: Browser mic → AudioWorklet → 16kHz PCM → base64 → WebSocket → Gemini
- **Output**: Gemini → 24kHz PCM → base64 → WebSocket → AudioContext → BufferSource playback
- **Rate detection**: Output mime type is parsed for `rate=` parameter (defaults to 24000)
- **Resampling**: Client resamples from native mic rate to 16kHz before encoding

## Reconnection Strategy

**Server-side**: Max 3 attempts with exponential backoff (1s → 2s → 4s, cap 8s). Counter resets on success.

**Client-side**: Max 5 attempts with exponential backoff (2s → 3s → 4.5s, cap 15s). Counter resets on `setup_complete`.

## Page ID Mapping

The server uses page keys that differ from HTML element IDs:

| Server Page Key | HTML Element ID | Display Name |
|----------------|-----------------|--------------|
| `home` | `home` | Consulting Services |
| `friday` | `friday` | Agent Friday |
| `declaration` | `declaration` | Declaration of Digital Independence |
| `claw` | `claw-spec` | The cLaw Specification |
| `certification` | `certification` | Asimov Agent Certification |
| `leadership` | `about` | About / Leadership |

Client-side mapping: `getCurrentPage()` translates `claw-spec` → `claw` and `about` → `leadership`.
Navigate handler translates `claw` → `claw-spec` and `leadership` → `about`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google AI API key for Gemini Live API access |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | No | For invoice payments |
| `RESEND_API_KEY` | No | For sending emails |

## System Instruction Structure

The system instruction is dynamically built per session:

1. **Base instruction**: Agent Friday's identity, rules, conversation behavior
2. **Feature documentation**: All 11 capability tiers documented inline
3. **Available sections per page**: Which IDs Friday can target
4. **Step tracking**: Dynamic based on session state (new user, returning user, name known, email collected)
5. **Page context**: Current page talking points
6. **Reconnection context**: Conversation history for seamless continuation

## CSS Classes Reference

| Class | Purpose |
|-------|---------|
| `.friday-highlight` | Pulsing cyan/purple glow outline on a section |
| `.friday-cinematic-spotlight` | Box-shadow cutout effect for cinematic mode |
| `.friday-cinematic-overlay` | Full-page dark overlay for cinematic mode |
| `.friday-annotation` | Floating glass-panel note |
| `.friday-ambient-orb` | Persistent floating presence indicator |
| `.friday-flow-card` | Guided flow intake card |
| `.persona-developer` / `.persona-executive` / `.persona-researcher` | Body-level persona mode classes |
| `.dev-emphasis` / `.exec-emphasis` / `.research-emphasis` | Section-level persona target classes |
| `.friday-visitor-count` | Active visitor count indicator |

## Testing Checklist

- [ ] Voice toggle activates/deactivates cleanly
- [ ] Greeting plays on first connection
- [ ] User speech is detected and model responds
- [ ] Page navigation works (all 6 pages)
- [ ] Section scrolling works
- [ ] Highlight effect appears and fades
- [ ] Cinematic spotlight dims page and spotlights target
- [ ] Annotations appear next to target sections
- [ ] All 3 interactive demos load and animate
- [ ] Persona switching changes section emphasis
- [ ] Guided flow card appears, accumulates answers, shows summary
- [ ] Booking widget opens with selectable time slots
- [ ] Ambient orb reflects speaking/listening state
- [ ] Visitor count shows when > 1 connection
- [ ] Scroll dwell data accumulates in session
- [ ] Reconnection works after unexpected disconnect
- [ ] Session persists across reconnections (name, history, context)
