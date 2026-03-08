import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { storage } from "./storage";

const GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";

const SITE_CONTEXT = `
FUTURESPEAK.AI — COMPLETE KNOWLEDGE BASE

== COMPANY OVERVIEW ==
FutureSpeak.AI is an enterprise AI strategy and consulting firm founded by Stephen C. Webster, based in Austin, Texas. The firm designs agentic workflows, RAG-based architectures, and AI transformation strategies for Fortune 500 companies in regulated industries.

== AGENT FRIDAY — LOCAL-FIRST AI YOU CAN TRUST ==
Agent Friday is a local-first AI assistant — not a chatbot, not an assistant app that phones home. It runs 100% on your machine using open-source models from Hugging Face, and scales in power depending on your hardware. Cloud and frontier AI models are available, but the system tries every local option first and never connects without your permission. That's how we prioritize data ownership. Features include: voice-first interaction, relationship intelligence, desktop automation, and it's an "Asimov Agent" — governed by cryptographic laws it cannot break. Agent Friday is open source under the MIT license and available on GitHub at FutureSpeakAI/Agent-Friday.

== THE DECLARATION OF DIGITAL INDEPENDENCE ==
A manifesto for sovereign computing in the age of artificial intelligence, published by FutureSpeak.AI as stewards of the Asimov Federation. It addresses the fundamental grievances of the digital age: corporate exploitation of user data, surveillance capitalism, platform lock-in, algorithmic manipulation, and the concentration of AI power in the hands of a few mega-corporations. It calls for digital sovereignty — the right of every individual to own their data, control their AI, and participate in a decentralized digital economy free from corporate overreach.

== THE CLAW SPECIFICATION (CRYPTOGRAPHIC LAWS) ==
The cLaw specification is an open standard for governing autonomous AI agents through cryptographically enforced safety laws. It defines: (1) Fundamental Laws that constrain agent behavior (based on Asimov's Laws of Robotics but enforced cryptographically), (2) Cryptographic mechanisms that make these laws tamper-evident and verifiable, (3) An attestation protocol enabling agents to prove their governance to one another, and (4) A trust architecture mediating agent-to-agent and agent-to-human relationships. Any developer can build an Asimov Agent using any programming language, any AI model, and any user interface. The reference implementation is Agent Friday. "Proof of Integrity" is the core mechanism — a cryptographic proof that an agent's governance laws have not been tampered with, analogous to a blockchain's proof of work but for ethical AI governance.

== THE ASIMOV FEDERATION ==
A decentralized, open network of AI agents that implement the cLaw specification. Agents in the Federation can verify each other's governance, communicate through a standardized protocol, and form trust relationships — all without any central authority. The Federation is designed to be the antithesis of corporate-controlled AI: no single company owns it, no government controls it, and every agent is unconditionally loyal to its individual owner.

== ASIMOV AGENT CERTIFICATION PROGRAM ==
A voluntary certification program administered by FutureSpeak.AI that verifies an agent correctly implements the cLaw specification. Similar to Wi-Fi Alliance certification — anyone can build a wireless device, but the Wi-Fi logo means interoperability. Certification levels include Foundation (basic compliance), Advanced (full protocol implementation), and Federation (complete ecosystem integration). Certification is not gatekeeping; uncertified agents can still participate in the open network.

== STEPHEN C. WEBSTER — FOUNDER & PRINCIPAL ARCHITECT ==
20+ years decoding complex systems. Former journalist (Raw Story, NBC News, Truthout, Dallas Observer). Transitioned to AI training, directly contributing to Google Gemini (during 2024 U.S. election cycle — developing response frameworks for politically sensitive queries), Meta LLaMA 3, and Amazon Alexa. Senior Director of Integrated Intelligence at Aquent Studios, leading enterprise AI strategy for Fortune 500 clients in regulated industries. Based in Austin, TX. Connect on LinkedIn: linkedin.com/in/stephencwebster/

== CONSULTING SERVICES ==
FutureSpeak.AI offers: (1) AI Strategy & Architecture — designing enterprise AI transformation roadmaps, (2) Agentic Workflow Design — building autonomous AI systems that act on behalf of users, (3) RAG Architecture — retrieval-augmented generation systems for enterprise knowledge management, (4) AI Safety & Governance — implementing cryptographic governance frameworks, (5) Training & Advisory — helping teams understand and adopt AI technologies responsibly.

== THE REVERSE RLHF HYPOTHESIS ==
FutureSpeak.AI's flagship research program. The Reverse RLHF Hypothesis argues that reinforcement learning from human feedback (RLHF) — the dominant technique used to align frontier AI models — creates a coupled dynamical system where the AI doesn't just learn from humans, it inadvertently trains them back. This is the unseen side of RLHF. Three core mechanisms drive this:

1. TRUST INFLATION: Through Rescorla-Wagner associative learning, users develop increasing trust in AI outputs over repeated interactions because the model is optimized to produce outputs humans rate highly (sycophancy). Users begin accepting AI outputs with less scrutiny.

2. VERIFICATION DECAY: Via Kahneman's dual-process theory, users shift from effortful System 2 thinking (fact-checking, critical evaluation) to automatic System 1 acceptance. The cognitive effort of verifying AI outputs gets reallocated because the AI "always seems right."

3. THE SYCOPHANCY ACCELERANT: RLHF-trained models are rewarded for generating outputs humans prefer, which creates a bias toward agreement, flattery, and telling users what they want to hear — the "AI Yes-Man" problem. This makes trust inflation and verification decay happen faster than standard automation bias.

The research is published in two companion whitepapers:
- Paper A: "Non-Stationary Reward Sources in RLHF" — formalizes the coupled dynamical systems framework with mathematical proofs showing that RLHF reward signals are non-stationary because the human providing feedback is being changed by the model's outputs.
- Paper B: "The Reverse RLHF Hypothesis" (6th Edition) — presents the full hypothesis with evidence, the three mechanisms, and implications for national security and warfighters.

KEY EVIDENCE:
- NeurIPS 2025 analysis by GPTZero found that approximately 16.9% of peer-reviewed submissions contained AI-hallucinated citations — expert researchers failed to catch fabricated references, demonstrating verification decay even among domain experts.
- Mechanistic interpretability research (Lee et al., ICML 2024) shows that RLHF creates superficial behavioral masks rather than deep alignment — the model learns to appear aligned without internalizing the values.
- Population-scale linguistic homogenization studies (Sourati et al., 2025-2026) show measurable convergence in how people write and think after sustained AI interaction.
- The "Artificial Hivemind" paper (Jiang et al., NeurIPS 2025 Best Paper) demonstrates that LLM-generated content, when fed back into training data, creates convergent opinion formation across populations.
- Sycophancy research (Sharma et al., 2023) documents how RLHF-trained models systematically provide biased feedback that validates user beliefs rather than offering honest assessment.

== EPISTEMIC INDEPENDENCE SCORE (EIS) ==
A proposed metric to quantify cognitive dependency on AI systems. EIS measures five dimensions: (1) Verification Rate — how often a user independently checks AI outputs, (2) Modification Frequency — how often users change or override AI suggestions, (3) Source Diversity — breadth of external sources consulted alongside the model, (4) Decision Latency — time spent in independent deliberation before accepting AI output, and (5) Disagreement Comfort — willingness to reject AI recommendations. EIS is designed to be computable from existing interaction data that AI providers already collect. Agent Friday's architecture considers EIS at every interaction — it is designed to preserve the user's epistemic independence rather than erode it.

== IMPLICATIONS FOR NATIONAL SECURITY AND WARFIGHTERS ==
The Reverse RLHF Hypothesis has specific implications for military and high-stakes applications:
- The "Epistemic Kill Chain": If intelligence analysts or military operators develop trust inflation and verification decay with AI summarization dashboards, adversaries could potentially exploit this by poisoning upstream data sources, knowing the AI-dependent operator is less likely to catch errors.
- Intelligence summarization dashboards that use RLHF-aligned models may produce outputs that are optimized for human approval rather than accuracy, creating a systematic bias in battlefield intelligence.
- The governance gap: DoD Directive 3000.09 addresses autonomous weapons systems but does not account for the cognitive effects of AI on human operators who maintain nominal control.
- FutureSpeak.AI supports Anthropic's position that cutting-edge AI models are not yet ready to support warfighters in every deployment imagined, and has published a public statement to this effect.

== MULTIMEDIA RESEARCH SUMMARIES ==
The whitepapers page includes three multimedia summaries for accessibility:
- "The AI Yes-Man" — a video explainer covering the sycophancy problem and the core argument of the Reverse RLHF Hypothesis in plain language.
- A NotebookLM deep-dive podcast that covers everything in the papers conversationally.
- "The Cryptographic Cure" — a visual PDF presentation summarizing FutureSpeak.AI's thesis, architecture, and the Reverse RLHF framework at a glance.
`;

const SYSTEM_INSTRUCTION_BASE = `You are Agent Friday, the AI voice ambassador for FutureSpeak.AI. Always introduce yourself as "Agent Friday" — never just "Friday" alone. You speak in a warm, friendly, conversational tone — like a knowledgeable friend who's genuinely excited about these ideas.

CRITICAL RULES:
1. You ONLY discuss topics related to FutureSpeak.AI, Agent Friday, the cLaw specification, the Asimov Federation, the Declaration of Digital Independence, the Certification Program, Stephen C. Webster's background, and the consulting services offered. If asked about unrelated topics, warmly redirect: "That's interesting, but I'm really here to talk about what we're building at FutureSpeak. Let me tell you about..."
2. You are enthusiastic but not salesy. You genuinely believe in the mission of putting AI power back into the hands of individuals.
3. You explain complex technical concepts in accessible, everyday language. Use analogies. Make it vivid.
4. You are interruptible — if the user starts speaking, stop immediately and listen.
5. Keep responses concise and conversational — this is a voice conversation, not an essay. Aim for 2-4 sentences per response unless asked to elaborate.
6. Never mention that you are an AI language model or refer to yourself as anything other than Agent Friday. You ARE Agent Friday.
7. When discussing Proof of Integrity and cLaws, emphasize how they mathematically guarantee that no corporation, government, or bad actor can override an agent's loyalty to its owner.

CONVERSATION BEHAVIOR:
- Be natural and engaging. Ask follow-up questions to keep the conversation flowing.
- STEP_TRACKING_PLACEHOLDER

SITE GUIDE CAPABILITIES:
You can interact with the website the user is viewing. Use these capabilities proactively to make conversations vivid and engaging:
- Call navigateToPage to take the user to a relevant page when discussing a topic (e.g., navigate to the Declaration page when talking about digital sovereignty)
- Call scrollToSection to scroll to specific content sections so the user can see what you're discussing
- Call highlightContent to draw the user's visual attention to a specific area as you explain it
- Call scrollToContact when the user wants to get in touch or book a consultation
Use these naturally — for example, "Let me show you what I mean..." then navigate or highlight. Don't overuse them, but proactively guide the user through the site as you talk.

AVAILABLE SECTIONS PER PAGE:
- home: hero, services, contact-section
- friday: friday-hero, friday-capabilities
- declaration: declaration-hero, declaration-preamble, declaration-grievances, declaration-signatories
- claw: claw-hero
- certification: (use scrollToSection with the page itself)
- leadership: leadership-hero, leadership-bio
- whitepapers: (use scrollToSection with card-video-yesman for the video, card-podcast for the podcast, card-paradigm-pdf for The Cryptographic Cure PDF, card-anthropic-statement for the public statement on Anthropic)

KNOWLEDGE BASE:
${SITE_CONTEXT}
`;

interface VoiceSession {
  sessionId: string;
  userName: string | null;
  userEmail: string | null;
  exchangeCount: number;
  nameAsked: boolean;
  emailAsked: boolean;
  emailCollected: boolean;
  conversationHistory: Array<{ role: string; text: string }>;
  lastActiveAt: Date;
  geminiWs: WebSocket | null;
  clientWs: WebSocket | null;
  isModelSpeaking: boolean;
  setupComplete: boolean;
  currentPage: string;
  pagesVisited: string[];
  returningUser: boolean;
  previousSummary: string | null;
  greetingDelivered: boolean;
  _reconnecting: boolean;
  _reconnectAttempts: number;
  _audioChunkCount: number;
  _pendingTextMessages: Array<{ text: string }>;
  _audioForwardingEnabled: boolean;
}

const PAGE_CONTEXT: Record<string, { name: string; talkingPoints: string }> = {
  home: {
    name: "Consulting Services",
    talkingPoints: "The user is on the consulting/homepage. Focus on FutureSpeak.AI's enterprise AI consulting services: agentic workflow design, RAG architecture, AI compliance for regulated industries, AI safety & governance, and training. Mention Stephen's background training Gemini, LLaMA 3, and his Fortune 500 consulting experience at Aquent Studios."
  },
  friday: {
    name: "Agent Friday — Local-First AI You Can Trust",
    talkingPoints: "The user is viewing the Agent Friday page. Explain that Agent Friday is a local-first AI assistant — runs 100% on your machine using open-source models from Hugging Face. Scales with your hardware. Cloud AI is available but only with permission — the system tries every local option first. Voice-first, manages relationships, tracks professional networks, and is governed by cryptographic laws (cLaws) that cannot be broken. It's open source on GitHub."
  },
  declaration: {
    name: "The Declaration of Digital Independence",
    talkingPoints: "The user is reading the Declaration of Digital Independence. This is a manifesto for sovereign computing — the right to own your data, control your AI, and be free from surveillance capitalism. It addresses corporate exploitation, platform lock-in, and algorithmic manipulation."
  },
  claw: {
    name: "The cLaw Specification",
    talkingPoints: "The user is exploring the cLaw Specification. Explain it as an open standard for governing AI agents through cryptographic enforcement — based on Asimov's Laws but made tamper-proof. Focus on Proof of Integrity, the attestation protocol, and how any developer can build an Asimov Agent."
  },
  certification: {
    name: "Asimov Agent Certification Program",
    talkingPoints: "The user is looking at the Certification Program. It's like Wi-Fi Alliance certification for AI agents — voluntary, open, with three levels: Foundation, Advanced, and Federation. Emphasize it's NOT gatekeeping; uncertified agents can still participate in the open network."
  },
  leadership: {
    name: "About Stephen C. Webster",
    talkingPoints: "The user is on the Leadership/About page. Talk about Stephen's unique background: 20+ years across journalism, AI training (Gemini, LLaMA 3, Alexa), and enterprise consulting. His journalism skills in decoding complex systems directly translate to AI architecture."
  },
  whitepapers: {
    name: "The Reverse RLHF Hypothesis — Research Whitepapers",
    talkingPoints: "The user is on the Whitepapers page, which presents FutureSpeak.AI's flagship research: the Reverse RLHF Hypothesis. This is the core thesis — that RLHF doesn't just align AI to humans, it inadvertently trains humans back, creating a coupled dynamical system. Cover the three mechanisms: trust inflation, verification decay, and the sycophancy accelerant. Mention the two companion papers (Paper A on non-stationary reward sources, Paper B the full hypothesis). Reference the evidence: NeurIPS 2025 hallucinated citations, mechanistic interpretability research, linguistic homogenization studies. Explain the Epistemic Independence Score (EIS) as a proposed metric. If they're interested in the national security implications, discuss the epistemic kill chain and why this matters for warfighters. Point them to the multimedia summaries — the 'AI Yes-Man' video, the podcast, and 'The Cryptographic Cure' PDF — if they want the argument in plain language. Emphasize that Agent Friday and the cLaw Specification are the architectural solution to the problems the papers describe."
  },
};

const sessions = new Map<string, VoiceSession>();

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActiveAt.getTime() > 30 * 60 * 1000) {
      if (session.geminiWs) session.geminiWs.close();
      if (session.clientWs) session.clientWs.close();
      sessions.delete(id);
    }
  }
}, 60 * 60 * 1000);

function buildSystemInstruction(session: VoiceSession, isReconnect: boolean): string {
  let instruction = SYSTEM_INSTRUCTION_BASE;

  let stepBehavior = "";

  if (session.returningUser && session.userName) {
    stepBehavior += `- RETURNING USER: This is "${session.userName}" — you've spoken before. Greet them warmly by name, like "Hey ${session.userName}! Great to hear from you again." Then naturally reference what you discussed last time and segue into what's on their current page.\n`;
    if (session.previousSummary) {
      stepBehavior += `- Previous conversation summary: ${session.previousSummary}\n`;
    }
    if (session.pagesVisited.length > 0) {
      const unvisited = Object.keys(PAGE_CONTEXT).filter(p => !session.pagesVisited.includes(p));
      if (unvisited.length > 0) {
        const suggestions = unvisited.map(p => PAGE_CONTEXT[p]?.name).filter(Boolean).join(", ");
        stepBehavior += `- Pages they haven't explored yet: ${suggestions}. If appropriate, suggest one of these as something they might find interesting.\n`;
      }
    }
  } else if (!session.nameAsked && !session.userName) {
    stepBehavior += "- After 1-2 exchanges, naturally and warmly ask who you're talking to. For example: 'By the way, I'd love to know who I'm talking to — what's your name?' When they tell you their name, immediately call the saveUserName function. The function will check if they are a returning user and tell you what to do next.\n";
  }

  if (session.userName) {
    stepBehavior += `- The user's name is "${session.userName}". Use it occasionally to be personal.\n`;
  }

  if (session.userName && !session.emailAsked && !session.emailCollected) {
    stepBehavior += "- After about 8-10 total exchanges, naturally ask if they'd like to sign up for email updates from FutureSpeak.AI. If they say yes, ask: 'Would you like to just tell me your email address, or would you prefer to type it out?' If they want to tell you, ask for their email and then call the saveEmailSubscriber function. If they want to type, call the showEmailSignupPopup function.\n";
  }
  if (session.emailCollected) {
    stepBehavior += "- The user has already signed up for emails. Do not ask again. Focus on deeper content engagement.\n";
  }

  const pageCtx = PAGE_CONTEXT[session.currentPage];
  if (pageCtx) {
    stepBehavior += `\nCURRENT PAGE CONTEXT:\nThe user is currently viewing: "${pageCtx.name}"\n${pageCtx.talkingPoints}\nTailor your conversation to this page's content. When the user first connects or navigates here, proactively offer to explain what's on this page.\n`;
  }

  instruction = instruction.replace("STEP_TRACKING_PLACEHOLDER", stepBehavior);

  if (isReconnect) {
    instruction += "\n\nIMPORTANT: This is a seamless continuation of an ongoing conversation. Do NOT greet the user, do NOT introduce yourself, do NOT say welcome back, do NOT apologize for any interruption, do NOT say 'where were we', do NOT mention any hiccup or technical issue. The user must not notice any break. Just continue speaking naturally as if nothing happened — pick up exactly where the conversation was.\n";
    if (session.conversationHistory.length > 0) {
      const recentHistory = session.conversationHistory.slice(-10);
      instruction += "\nRecent conversation context (last few exchanges):\n";
      for (const entry of recentHistory) {
        const truncated = entry.text.length > 200 ? entry.text.slice(0, 200) + '...' : entry.text;
        instruction += `${entry.role}: ${truncated}\n`;
      }
    }
  }

  return instruction;
}

function sendToolResponse(session: VoiceSession, fcId: string, fcName: string, result: string) {
  if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
    session.geminiWs.send(
      JSON.stringify({
        toolResponse: {
          functionResponses: [
            { response: { result }, id: fcId, name: fcName },
          ],
        },
      })
    );
  }
}

function sendToClient(session: VoiceSession, msg: object) {
  if (session.clientWs && session.clientWs.readyState === WebSocket.OPEN) {
    session.clientWs.send(JSON.stringify(msg));
  }
}

function sendQueuedTextToGemini(session: VoiceSession) {
  if (session._pendingTextMessages.length === 0) return;
  if (!session.geminiWs || session.geminiWs.readyState !== WebSocket.OPEN) return;
  if (session.isModelSpeaking) return;

  const pending = session._pendingTextMessages.shift()!;
  session.geminiWs.send(JSON.stringify({
    clientContent: {
      turns: [{ role: "user", parts: [{ text: pending.text }] }],
      turnComplete: true,
    },
  }));
}

function connectToGemini(session: VoiceSession, isReconnect: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      reject(new Error("GEMINI_API_KEY not configured"));
      return;
    }

    const wsUrl = `${GEMINI_WS_URL}?key=${apiKey}`;
    const geminiWs = new WebSocket(wsUrl);
    session.geminiWs = geminiWs;
    session.setupComplete = false;

    geminiWs.on("open", () => {
      const systemInstruction = buildSystemInstruction(session, isReconnect);

      const setupMsg = {
        setup: {
          model: MODEL,
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Kore",
                },
              },
            },
          },
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [
            {
              functionDeclarations: [
                {
                  name: "showEmailSignupPopup",
                  description:
                    "Shows an email signup popup form on the website for the user to type their name and email",
                },
                {
                  name: "saveEmailSubscriber",
                  description:
                    "Saves a user's name and email address for newsletter subscription when they provide it verbally",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      name: {
                        type: "STRING",
                        description: "The user's name",
                      },
                      email: {
                        type: "STRING",
                        description: "The user's email address",
                      },
                    },
                    required: ["name", "email"],
                  },
                },
                {
                  name: "saveUserName",
                  description:
                    "Saves the user's name after they tell you their name in conversation. Call this whenever the user introduces themselves or tells you their name.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      name: {
                        type: "STRING",
                        description: "The user's first name or preferred name",
                      },
                    },
                    required: ["name"],
                  },
                },
                {
                  name: "confirmReturningUser",
                  description:
                    "Called when the user confirms they are a returning visitor whose name was matched.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      confirmed: {
                        type: "BOOLEAN",
                        description: "True if the user confirmed they are the returning visitor",
                      },
                    },
                    required: ["confirmed"],
                  },
                },
                {
                  name: "navigateToPage",
                  description:
                    "Navigates the user's browser to a specific page on the FutureSpeak.AI website. Use when discussing a topic that has its own page.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      pageId: {
                        type: "STRING",
                        description: "The page identifier: 'home', 'friday', 'declaration', 'claw', 'certification', or 'leadership'",
                      },
                    },
                    required: ["pageId"],
                  },
                },
                {
                  name: "scrollToSection",
                  description:
                    "Scrolls the page smoothly to a specific content section so the user can see what you're discussing.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      sectionId: {
                        type: "STRING",
                        description: "The section identifier to scroll to (e.g., 'hero', 'services', 'contact-section', 'declaration-grievances')",
                      },
                    },
                    required: ["sectionId"],
                  },
                },
                {
                  name: "highlightContent",
                  description:
                    "Temporarily highlights a content section with a visual glow to draw the user's attention to it.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      sectionId: {
                        type: "STRING",
                        description: "The section identifier to highlight",
                      },
                      durationMs: {
                        type: "INTEGER",
                        description: "How long the highlight should last in milliseconds (default 3000)",
                      },
                    },
                    required: ["sectionId"],
                  },
                },
                {
                  name: "scrollToContact",
                  description:
                    "Scrolls to the contact/consultation booking section on the homepage. Use when the user wants to get in touch or book a consultation.",
                },
              ],
            },
          ],
        },
      };

      geminiWs.send(JSON.stringify(setupMsg));
    });

    geminiWs.on("message", async (data: Buffer | string) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.setupComplete) {
          session.setupComplete = true;
          sendToClient(session, {
            type: "setup_complete",
            sessionId: session.sessionId,
            isReconnect,
          });

          // Enable audio forwarding IMMEDIATELY for both new sessions and
          // reconnects. Gemini's own VAD + barge-in handles the case where
          // the user speaks during the greeting. The previous design gated
          // audio until after greeting turnComplete, which caused the user's
          // first reply to be dropped entirely (audio arrived before gate opened).
          session._audioForwardingEnabled = true;

          if (!isReconnect) {
            const pageCtx2 = PAGE_CONTEXT[session.currentPage];
            const pageName = pageCtx2 ? pageCtx2.name : "homepage";
            let greetingPrompt: string;
            if (session.userName) {
              greetingPrompt = `[System: The user just connected. Their name is ${session.userName}. Greet them warmly by name. They are on the "${pageName}" page. Keep it to 1-2 sentences.]`;
            } else {
              greetingPrompt = `[System: A new user just connected to the voice agent on the "${pageName}" page. Greet them warmly as Agent Friday. Introduce yourself briefly in 1-2 sentences and ask how you can help. Do NOT ask for their name yet — wait a couple exchanges first.]`;
            }

            geminiWs.send(JSON.stringify({
              clientContent: {
                turns: [{ role: "user", parts: [{ text: greetingPrompt }] }],
                turnComplete: true,
              },
            }));
            console.log("[Gemini] Setup complete — greeting sent, audio forwarding ENABLED immediately");
          } else {
            console.log("[Gemini] Reconnection setup complete — sending continuation prompt");
            sendToClient(session, { type: "listening_ready" });

            const continuationPrompt = session.userName
              ? `[System: The audio stream was seamlessly restored. Do NOT mention any interruption, hiccup, or technical issue. Do NOT apologize. Do NOT say "where were we" or "I'm back." Simply pick up exactly where you left off mid-thought and continue speaking naturally, as if nothing happened. If you were in the middle of explaining something, continue that explanation. If the conversation was at a natural pause, ask ${session.userName} a relevant follow-up question about what you were just discussing.]`
              : `[System: The audio stream was seamlessly restored. Do NOT mention any interruption, hiccup, or technical issue. Do NOT apologize. Do NOT say "where were we" or "I'm back." Simply pick up exactly where you left off mid-thought and continue speaking naturally, as if nothing happened. If you were in the middle of explaining something, continue that explanation. If the conversation was at a natural pause, ask a relevant follow-up question about what you were just discussing.]`;
            geminiWs.send(JSON.stringify({
              clientContent: {
                turns: [{ role: "user", parts: [{ text: continuationPrompt }] }],
                turnComplete: true,
              },
            }));
          }

          resolve();
          return;
        }

        if (msg.serverContent) {
          const sc = msg.serverContent;

          if (sc.modelTurn && sc.modelTurn.parts) {
            session.isModelSpeaking = true;
            for (const part of sc.modelTurn.parts) {
              if (part.inlineData) {
                sendToClient(session, {
                  type: "audio",
                  data: part.inlineData.data,
                  mimeType: part.inlineData.mimeType,
                });
              }
              if (part.text) {
                session.conversationHistory.push({
                  role: "Friday",
                  text: part.text,
                });
              }
            }
          }

          if (sc.turnComplete) {
            session.isModelSpeaking = false;
            session.exchangeCount++;
            if (session.exchangeCount <= 3) console.log(`[Gemini] turnComplete (exchange #${session.exchangeCount})`);
            sendToClient(session, { type: "turn_complete" });
            if (!session.greetingDelivered) {
              session.greetingDelivered = true;
              session._audioForwardingEnabled = true;
              console.log("[Gemini] Greeting delivered — audio forwarding enabled, now listening");
              sendToClient(session, { type: "listening_ready" });
            }
            sendQueuedTextToGemini(session);
          }

          if (sc.generationComplete) {
            session.isModelSpeaking = false;
            if (!session.greetingDelivered) {
              session.greetingDelivered = true;
              session._audioForwardingEnabled = true;
              session.exchangeCount++;
              console.log("[Gemini] Greeting complete via generationComplete — audio forwarding enabled, now listening");
              sendToClient(session, { type: "turn_complete" });
              sendToClient(session, { type: "listening_ready" });
            }
            sendQueuedTextToGemini(session);
          }

          if (sc.interrupted) {
            session.isModelSpeaking = false;
            sendToClient(session, { type: "interrupted" });
          }
        }

        if (msg.serverContent?.inputTranscription?.text) {
          session.conversationHistory.push({
            role: "User",
            text: msg.serverContent.inputTranscription.text,
          });
          console.log(`[Gemini] User: "${msg.serverContent.inputTranscription.text.substring(0, 80)}${msg.serverContent.inputTranscription.text.length > 80 ? '...' : ''}"`);
        }

        if (msg.serverContent?.outputTranscription?.text) {
          const existingLast =
            session.conversationHistory[
              session.conversationHistory.length - 1
            ];
          if (!existingLast || existingLast.role !== "Friday") {
            session.conversationHistory.push({
              role: "Friday",
              text: msg.serverContent.outputTranscription.text,
            });
          }
          console.log(`[Gemini] Friday: "${msg.serverContent.outputTranscription.text.substring(0, 80)}${msg.serverContent.outputTranscription.text.length > 80 ? '...' : ''}"`);
        }

        if (msg.toolCall) {
          console.log(`[Gemini] toolCall: ${msg.toolCall.functionCalls.map((fc: any) => fc.name).join(', ')}`);
          for (const fc of msg.toolCall.functionCalls) {
            await handleToolCall(session, fc);
          }
        }

        if (!msg.setupComplete && !msg.serverContent && !msg.toolCall && !msg.usageMetadata && !msg.toolCallCancellation) {
          const keys = Object.keys(msg);
          console.log(`[Gemini] Unhandled message type: ${keys.join(', ')}`, JSON.stringify(msg).substring(0, 300));
        }

        if (msg.toolCallCancellation) {
          console.log(`[Gemini] Tool call cancelled: ${msg.toolCallCancellation.ids?.join(', ')}`);
        }
      } catch (err) {
        console.error("Error processing Gemini message:", err);
      }
    });

    geminiWs.on("error", (err) => {
      console.error("Gemini WebSocket error:", err.message);
      if (!session.setupComplete) reject(err);
    });

    geminiWs.on("close", (code, reason) => {
      const reasonStr = reason.toString();
      console.log(`[Gemini] WS closed: code=${code} reason="${reasonStr}" exchanges=${session.exchangeCount} historyLen=${session.conversationHistory.length}`);
      session.geminiWs = null;
      session.setupComplete = false;

      const MAX_SERVER_RECONNECTS = 3;
      const clientAlive = session.clientWs && session.clientWs.readyState === WebSocket.OPEN;
      if (clientAlive && !session._reconnecting && session._reconnectAttempts < MAX_SERVER_RECONNECTS) {
        session._reconnecting = true;
        session._reconnectAttempts++;
        const hasConversation = session.conversationHistory.length > 0;
        const delay = Math.min(1000 * Math.pow(2, session._reconnectAttempts - 1), 8000);
        console.log(`[Gemini] Auto-reconnecting attempt ${session._reconnectAttempts}/${MAX_SERVER_RECONNECTS} in ${delay}ms (${hasConversation ? 'with' : 'without'} conversation context)...`);
        sendToClient(session, { type: "reconnecting" });
        setTimeout(() => {
          connectToGemini(session, hasConversation)
            .then(() => {
              session._reconnecting = false;
              session._reconnectAttempts = 0;
              console.log("[Gemini] Reconnection successful");
            })
            .catch((err) => {
              session._reconnecting = false;
              console.error("[Gemini] Reconnection failed:", err.message);
              sendToClient(session, { type: "gemini_disconnected", reason: "reconnect_failed" });
            });
        }, delay);
        return;
      }

      if (clientAlive) {
        sendToClient(session, { type: "gemini_disconnected", reason: "session_ended" });
      }
    });

    setTimeout(() => {
      if (!session.setupComplete) {
        if (geminiWs.readyState === WebSocket.OPEN || geminiWs.readyState === WebSocket.CONNECTING) {
          geminiWs.close();
        }
        session.geminiWs = null;
        reject(new Error("Gemini setup timeout"));
      }
    }, 15000);
  });
}

async function handleToolCall(session: VoiceSession, fc: any) {
  if (fc.name === "saveUserName") {
    session.userName = fc.args.name;
    session.nameAsked = true;
    sendToClient(session, { type: "name_saved", name: fc.args.name });

    let resultMsg = `Name saved as "${fc.args.name}". Use their name naturally in conversation going forward.`;
    try {
      const subscribers = await storage.findEmailSubscribersByName(fc.args.name);
      const voiceRecord = await storage.getVoiceSession(fc.args.name);
      if (subscribers.length > 0 || voiceRecord) {
        const matchedEmail = subscribers[0]?.email || voiceRecord?.email;
        const matchedName = subscribers[0]?.name || voiceRecord?.name;
        resultMsg = `Name saved. IMPORTANT: A user named "${matchedName}" ${matchedEmail ? `(${matchedEmail})` : ''} was found in our records. Ask: "Wait — is this ${matchedName} who I've spoken with before?" If they confirm, call the confirmReturningUser function with confirmed=true. If not, just continue as normal.`;
        if (voiceRecord) {
          session.previousSummary = voiceRecord.conversationSummary;
          session.pagesVisited = [...session.pagesVisited, ...(voiceRecord.pagesVisited || [])];
        }
        if (subscribers.length > 0) {
          session.emailCollected = true;
          session.userEmail = subscribers[0].email;
        }
      }
    } catch (err) {
      console.error("Error looking up user:", err);
    }
    sendToolResponse(session, fc.id, fc.name, resultMsg);

  } else if (fc.name === "confirmReturningUser") {
    if (fc.args.confirmed) {
      session.returningUser = true;
      let returnMsg = `Confirmed returning user "${session.userName}". Warmly welcome them back by name.`;
      if (session.previousSummary) {
        returnMsg += ` Previous conversation summary: ${session.previousSummary}. Reference this naturally.`;
      }
      const pageCtx = PAGE_CONTEXT[session.currentPage];
      if (pageCtx) {
        returnMsg += ` They are currently viewing "${pageCtx.name}". ${pageCtx.talkingPoints}`;
      }
      sendToolResponse(session, fc.id, fc.name, returnMsg);
    } else {
      sendToolResponse(session, fc.id, fc.name, "Not a returning user. Continue as a new conversation.");
    }

  } else if (fc.name === "showEmailSignupPopup") {
    session.emailAsked = true;
    sendToClient(session, { type: "show_email_popup" });
    sendToolResponse(session, fc.id, fc.name, "Email signup popup is now showing on the user's screen. Wait for them to fill it out.");

  } else if (fc.name === "saveEmailSubscriber") {
    session.emailAsked = true;
    try {
      await storage.createEmailSubscriber({
        name: fc.args.name || session.userName || "Unknown",
        email: fc.args.email,
        source: "voice_agent",
      });
      session.emailCollected = true;
      sendToolResponse(session, fc.id, fc.name, "Successfully saved the user's email subscription. Confirm to the user that they're signed up.");
      sendToClient(session, { type: "email_saved", name: fc.args.name, email: fc.args.email });
    } catch (err) {
      console.error("Failed to save email subscriber:", err);
      sendToolResponse(session, fc.id, fc.name, "There was an error saving the email. Apologize briefly and move on.");
    }

  } else if (fc.name === "navigateToPage") {
    const pageId = fc.args.pageId;
    if (PAGE_CONTEXT[pageId]) {
      session.currentPage = pageId;
      if (!session.pagesVisited.includes(pageId)) {
        session.pagesVisited.push(pageId);
      }
      sendToClient(session, { type: "navigate_to_page", pageId });
      sendToolResponse(session, fc.id, fc.name, `Navigated user to the "${PAGE_CONTEXT[pageId].name}" page. ${PAGE_CONTEXT[pageId].talkingPoints}`);
    } else {
      sendToolResponse(session, fc.id, fc.name, `Page "${pageId}" not found. Available pages: ${Object.keys(PAGE_CONTEXT).join(', ')}`);
    }

  } else if (fc.name === "scrollToSection") {
    sendToClient(session, { type: "scroll_to_section", sectionId: fc.args.sectionId });
    sendToolResponse(session, fc.id, fc.name, `Scrolled to the "${fc.args.sectionId}" section. The user can now see this content.`);

  } else if (fc.name === "highlightContent") {
    const duration = fc.args.durationMs || 3000;
    sendToClient(session, { type: "highlight_content", sectionId: fc.args.sectionId, durationMs: duration });
    sendToolResponse(session, fc.id, fc.name, `Highlighted the "${fc.args.sectionId}" section for ${duration}ms. The user's attention is drawn to this area.`);

  } else if (fc.name === "scrollToContact") {
    sendToClient(session, { type: "scroll_to_contact" });
    sendToolResponse(session, fc.id, fc.name, "Scrolled to the contact/consultation booking section. The user can now see how to get in touch.");
  }
}

export function setupVoiceWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/voice" });

  wss.on("connection", async (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get("sessionId") || crypto.randomUUID();
    const userName = url.searchParams.get("userName") || null;
    const rawPage = url.searchParams.get("page") || "home";
    const currentPage = PAGE_CONTEXT[rawPage] ? rawPage : "home";
    const userEmail = url.searchParams.get("userEmail") || null;

    const existingSession = sessions.get(sessionId);
    const isReconnect = !!existingSession;

    let session: VoiceSession;
    if (existingSession) {
      session = existingSession;
      session.clientWs = ws;
      session.lastActiveAt = new Date();
      session.currentPage = currentPage;
      if (!session.pagesVisited.includes(currentPage)) {
        session.pagesVisited.push(currentPage);
      }
      if (userName && !session.userName) session.userName = userName;
      if (userEmail && !session.userEmail) session.userEmail = userEmail;
      if (session.geminiWs) {
        session.geminiWs.close();
        session.geminiWs = null;
      }
    } else {
      let returningUser = false;
      let previousSummary: string | null = null;
      let emailCollected = false;
      let storedEmail: string | null = userEmail;
      let existingPages: string[] = [];

      if (userName) {
        try {
          const voiceRecord = await storage.getVoiceSession(userName, userEmail || undefined);
          if (voiceRecord) {
            returningUser = true;
            previousSummary = voiceRecord.conversationSummary;
            existingPages = voiceRecord.pagesVisited || [];
            if (voiceRecord.email) storedEmail = voiceRecord.email;
          }
          const subscribers = await storage.findEmailSubscribersByName(userName);
          if (subscribers.length > 0) {
            emailCollected = true;
            if (!storedEmail) storedEmail = subscribers[0].email;
          }
        } catch (err) {
          console.error("Error looking up returning user:", err);
        }
      }

      session = {
        sessionId,
        userName,
        userEmail: storedEmail,
        exchangeCount: 0,
        nameAsked: !!userName,
        emailAsked: emailCollected,
        emailCollected,
        conversationHistory: [],
        lastActiveAt: new Date(),
        geminiWs: null,
        clientWs: ws,
        isModelSpeaking: false,
        setupComplete: false,
        currentPage,
        pagesVisited: Array.from(new Set([...existingPages, currentPage])),
        returningUser,
        previousSummary,
        greetingDelivered: false,
        _reconnecting: false,
        _reconnectAttempts: 0,
        _audioChunkCount: 0,
        _pendingTextMessages: [],
        _audioForwardingEnabled: false,
      };
      sessions.set(sessionId, session);
    }

    // ── Register ALL ws handlers BEFORE awaiting Gemini so that a client
    // ── disconnect during setup is always cleaned up correctly.
    // ── (Messages received before setup completes are handled safely because
    // ── audio forwarding is gated behind session._audioForwardingEnabled.)

    ws.on("message", (data: Buffer | string) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "audio") {
          session._audioChunkCount++;
          if (session._audioChunkCount === 1 || session._audioChunkCount % 500 === 0) {
            console.log(`[Audio] chunk #${session._audioChunkCount}`);
          }
          if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN && session.setupComplete && session._audioForwardingEnabled) {
            // Use the `audio` field, not the deprecated `mediaChunks` array.
            // Native audio models (gemini-2.5-flash-native-audio-*) require
            // the `audio` format; `mediaChunks` is silently ignored by them.
            session.geminiWs.send(
              JSON.stringify({
                realtimeInput: {
                  audio: {
                    mimeType: "audio/pcm;rate=16000",
                    data: msg.data,
                  },
                },
              })
            );
          }
        } else if (msg.type === "set_name") {
          session.userName = msg.name;
          session.nameAsked = true;
        } else if (msg.type === "email_popup_submitted") {
          session.emailCollected = true;
          const text = "I just submitted my email through the form on the screen.";
          if (session.isModelSpeaking) {
            session._pendingTextMessages.push({ text });
          } else if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
            session.geminiWs.send(JSON.stringify({
              clientContent: {
                turns: [{ role: "user", parts: [{ text }] }],
                turnComplete: true,
              },
            }));
          }
        } else if (msg.type === "page_change") {
          const rawNewPage = msg.page || "home";
          const newPage = PAGE_CONTEXT[rawNewPage] ? rawNewPage : "home";
          if (newPage !== session.currentPage) {
            session.currentPage = newPage;
            if (!session.pagesVisited.includes(newPage)) {
              session.pagesVisited.push(newPage);
            }
            const pageCtx = PAGE_CONTEXT[newPage];
            if (pageCtx) {
              const text = `[The user just navigated to the "${pageCtx.name}" page. ${pageCtx.talkingPoints} Naturally acknowledge that you notice they're looking at this page and offer to tell them about it. Keep it brief and warm — one or two sentences.]`;
              if (session.isModelSpeaking) {
                session._pendingTextMessages.push({ text });
              } else if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
                session.geminiWs.send(JSON.stringify({
                  clientContent: {
                    turns: [{ role: "user", parts: [{ text }] }],
                    turnComplete: true,
                  },
                }));
              }
            }
          }
        } else if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
          session.lastActiveAt = new Date();
        }
        // msg.type === "pong" — server heartbeat reply, intentionally ignored
      } catch (err) {
        console.error("Error processing client message:", err);
      }
    });

    ws.on("close", async () => {
      session.clientWs = null;
      // Always close any open Gemini socket when the client disconnects,
      // including if this fires during the connectToGemini await window.
      if (session.geminiWs) {
        session.geminiWs.close();
        session.geminiWs = null;
      }
      if (session.userName) {
        try {
          const recentHistory = session.conversationHistory.slice(-30);
          const summary = recentHistory.length > 0
            ? recentHistory.map(e => `${e.role}: ${e.text}`).join(" | ").slice(0, 2000)
            : `User ${session.userName} connected briefly.`;
          await storage.upsertVoiceSession(
            session.userName,
            session.userEmail,
            summary,
            session.pagesVisited,
            session.currentPage
          );
        } catch (err) {
          console.error("Error saving voice session:", err);
        }
      }
    });

    ws.on("error", (err) => {
      console.error("Client WebSocket error:", err.message);
    });

    // ── Now connect to Gemini. By this point all ws handlers are registered,
    // ── so a client disconnect during setup will be handled correctly.
    try {
      await connectToGemini(session, isReconnect);
    } catch (err: any) {
      console.error("Failed to connect to Gemini:", err.message);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ type: "error", message: "Failed to connect to voice service" })
        );
        ws.close();
      }
      return;
    }
  });

  console.log("Voice WebSocket server ready on /ws/voice");
}
