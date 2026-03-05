import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { storage } from "./storage";

const GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const MODEL = "models/gemini-2.5-flash-native-audio-latest";

const SITE_CONTEXT = `
FUTURESPEAK.AI — COMPLETE KNOWLEDGE BASE

== COMPANY OVERVIEW ==
FutureSpeak.AI is an enterprise AI strategy and consulting firm founded by Stephen C. Webster, based in Austin, Texas. The firm designs agentic workflows, RAG-based architectures, and AI transformation strategies for Fortune 500 companies in regulated industries.

== AGENT FRIDAY — THE WORLD'S FIRST AGI OS ==
Agent Friday is a desktop AI operating system — not a chatbot, not an assistant. It's a voice-first AI chief of staff that talks, listens, remembers, learns your patterns, tracks your professional relationships, and evolves its personality over time. Think Jarvis meets the emotional depth of "Her," running locally on your machine with full privacy. Features include: 200+ AI models, relationship intelligence, voice-first interface, local execution for privacy, and it's an "Asimov Agent" — governed by cryptographic laws it cannot break. Agent Friday is open source under the MIT license and available on GitHub at FutureSpeakAI/Agent-Friday.

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

ADDITIONAL TOOLS:
You can also: cinematicSpotlight/dismissCinematic (dim page, spotlight a section), showAnnotation/dismissAnnotations (floating margin notes), triggerInteractiveDemo/dismissDemo (animated visualizations: 'proof-of-integrity', 'federation-handshake', 'onboarding-preview'), adaptSitePersona (reshape site for 'developer'/'executive'/'researcher'/'general'), startGuidedFlow/updateGuidedFlow/completeGuidedFlow (structured consulting intake), openBookingWidget (inline calendar), getVisitorInsight (visitor behavior data).

AVAILABLE SECTIONS PER PAGE:
- home: hero, services, contact-section
- friday: friday-hero, friday-capabilities
- declaration: declaration-hero, declaration-preamble, declaration-grievances, declaration-signatories
- claw: claw-hero
- certification: (use scrollToSection with the page itself)
- leadership: leadership-hero, leadership-bio

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
  dwellSections: Record<string, number>;
  annotationCount: number;
}

const PAGE_CONTEXT: Record<string, { name: string; talkingPoints: string }> = {
  home: {
    name: "Consulting Services",
    talkingPoints: "The user is on the consulting/homepage. Focus on FutureSpeak.AI's enterprise AI consulting services: agentic workflow design, RAG architecture, AI compliance for regulated industries, AI safety & governance, and training. Mention Stephen's background training Gemini, LLaMA 3, and his Fortune 500 consulting experience at Aquent Studios."
  },
  friday: {
    name: "Agent Friday — The World's First AGI OS",
    talkingPoints: "The user is viewing the Agent Friday page. Explain that Agent Friday is a desktop AI operating system — voice-first, runs locally, manages relationships, tracks professional networks, and is governed by cryptographic laws (cLaws) that cannot be broken. It's open source on GitHub. Think Jarvis meets 'Her.'"
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
};

const sessions = new Map<string, VoiceSession>();

function getActiveVisitorCount(): number {
  let count = 0;
  for (const [, s] of sessions) {
    if (s.clientWs && s.clientWs.readyState === WebSocket.OPEN) count++;
  }
  return count;
}

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
    stepBehavior += "- After 1-2 exchanges, naturally and warmly ask who you're talking to. For example: 'By the way, I'd love to know who I'm talking to — what's your name?' When they tell you their name, immediately call the saveUserName function. If the lookupUser function returns a match, ask 'Is this [name] who I've spoken with before?' If they confirm, warmly greet them as a returning visitor.\n";
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
    instruction += "\n\nIMPORTANT: This is a seamless continuation of an ongoing conversation. Do NOT greet the user, do NOT introduce yourself, and do NOT say welcome back. Just continue naturally as if there was no interruption. The user should not notice any break in the conversation.\n";
    if (session.conversationHistory.length > 0) {
      const recentHistory = session.conversationHistory.slice(-20);
      instruction += "\nRecent conversation context:\n";
      for (const entry of recentHistory) {
        instruction += `${entry.role}: ${entry.text}\n`;
      }
    }
  }

  return instruction;
}

function sendToolResponse(session: VoiceSession, fcId: string, result: string) {
  if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
    session.geminiWs.send(
      JSON.stringify({
        toolResponse: {
          functionResponses: [
            { response: { result }, id: fcId },
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
                {
                  name: "cinematicSpotlight",
                  description: "Dims the page and spotlights a section. Call dismissCinematic when done.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      sectionId: { type: "STRING", description: "Section to spotlight" },
                      narration: { type: "STRING", description: "Optional label shown below spotlight" },
                    },
                    required: ["sectionId"],
                  },
                },
                {
                  name: "dismissCinematic",
                  description: "Removes cinematic spotlight, returns page to normal.",
                },
                {
                  name: "showAnnotation",
                  description: "Shows a floating note next to a section.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      targetId: { type: "STRING", description: "Section to annotate" },
                      text: { type: "STRING", description: "Note text (1-2 sentences)" },
                      position: { type: "STRING", description: "'left' or 'right' (default 'right')" },
                    },
                    required: ["targetId", "text"],
                  },
                },
                {
                  name: "dismissAnnotations",
                  description: "Removes all floating annotations.",
                },
                {
                  name: "triggerInteractiveDemo",
                  description: "Shows animated visualization. IDs: 'proof-of-integrity', 'federation-handshake', 'onboarding-preview'. Call dismissDemo when done.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      demoId: { type: "STRING", description: "Demo identifier" },
                    },
                    required: ["demoId"],
                  },
                },
                {
                  name: "dismissDemo",
                  description: "Closes the active demo.",
                },
                {
                  name: "adaptSitePersona",
                  description: "Reshapes site emphasis: 'developer', 'executive', 'researcher', or 'general' (reset).",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      persona: { type: "STRING", description: "Visitor persona" },
                    },
                    required: ["persona"],
                  },
                },
                {
                  name: "startGuidedFlow",
                  description: "Starts consulting intake. Use 'consulting-intake'.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      flowId: { type: "STRING", description: "Flow ID" },
                    },
                    required: ["flowId"],
                  },
                },
                {
                  name: "updateGuidedFlow",
                  description: "Records answer, advances guided flow.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      stepLabel: { type: "STRING", description: "Step label (e.g. 'Industry')" },
                      answer: { type: "STRING", description: "User's answer" },
                    },
                    required: ["stepLabel", "answer"],
                  },
                },
                {
                  name: "completeGuidedFlow",
                  description: "Completes guided flow, shows recommendation.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      summary: { type: "STRING", description: "Recommendation summary" },
                      recommendedServices: { type: "STRING", description: "Comma-separated services" },
                    },
                    required: ["summary", "recommendedServices"],
                  },
                },
                {
                  name: "openBookingWidget",
                  description: "Opens inline calendar for scheduling a consultation.",
                },
                {
                  name: "getVisitorInsight",
                  description: "Returns visitor browsing data: dwell times, pages visited, active visitor count.",
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

          if (!isReconnect) {
            session._audioForwardingEnabled = false;
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
            console.log("[Gemini] Setup complete, greeting sent (audio forwarding paused until greeting delivered)");
          } else {
            session._audioForwardingEnabled = true;
            console.log("[Gemini] Reconnection setup complete — listening (audio forwarding enabled)");
            sendToClient(session, { type: "listening_ready" });
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
            console.log(`[Gemini] turnComplete (exchanges=${session.exchangeCount})`);
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
            console.log(`[Gemini] generationComplete (exchanges=${session.exchangeCount}, greetingDelivered=${session.greetingDelivered})`);
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

        if (msg.serverContent?.inputTranscript) {
          session.conversationHistory.push({
            role: "User",
            text: msg.serverContent.inputTranscript,
          });
          console.log(`[Gemini] User said: "${msg.serverContent.inputTranscript}"`);
        }

        if (msg.serverContent?.outputTranscript) {
          const existingLast =
            session.conversationHistory[
              session.conversationHistory.length - 1
            ];
          if (!existingLast || existingLast.role !== "Friday") {
            session.conversationHistory.push({
              role: "Friday",
              text: msg.serverContent.outputTranscript,
            });
          }
          console.log(`[Gemini] Friday said: "${msg.serverContent.outputTranscript.substring(0, 100)}..."`);
        }

        if (msg.toolCall) {
          console.log(`[Gemini] toolCall: ${msg.toolCall.functionCalls.map((fc: any) => fc.name).join(', ')}`);
          for (const fc of msg.toolCall.functionCalls) {
            await handleToolCall(session, fc);
          }
        }

        if (!msg.setupComplete && !msg.serverContent && !msg.toolCall) {
          const keys = Object.keys(msg);
          console.log(`[Gemini] Unhandled message type: ${keys.join(', ')}`, JSON.stringify(msg).substring(0, 300));
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
    sendToolResponse(session, fc.id, resultMsg);

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
      sendToolResponse(session, fc.id, returnMsg);
    } else {
      sendToolResponse(session, fc.id, "Not a returning user. Continue as a new conversation.");
    }

  } else if (fc.name === "showEmailSignupPopup") {
    session.emailAsked = true;
    sendToClient(session, { type: "show_email_popup" });
    sendToolResponse(session, fc.id, "Email signup popup is now showing on the user's screen. Wait for them to fill it out.");

  } else if (fc.name === "saveEmailSubscriber") {
    session.emailAsked = true;
    try {
      await storage.createEmailSubscriber({
        name: fc.args.name || session.userName || "Unknown",
        email: fc.args.email,
        source: "voice_agent",
      });
      session.emailCollected = true;
      sendToolResponse(session, fc.id, "Successfully saved the user's email subscription. Confirm to the user that they're signed up.");
      sendToClient(session, { type: "email_saved", name: fc.args.name, email: fc.args.email });
    } catch (err) {
      console.error("Failed to save email subscriber:", err);
      sendToolResponse(session, fc.id, "There was an error saving the email. Apologize briefly and move on.");
    }

  } else if (fc.name === "navigateToPage") {
    const pageId = fc.args.pageId;
    if (PAGE_CONTEXT[pageId]) {
      session.currentPage = pageId;
      if (!session.pagesVisited.includes(pageId)) {
        session.pagesVisited.push(pageId);
      }
      sendToClient(session, { type: "navigate_to_page", pageId });
      sendToolResponse(session, fc.id, `Navigated user to the "${PAGE_CONTEXT[pageId].name}" page. ${PAGE_CONTEXT[pageId].talkingPoints}`);
    } else {
      sendToolResponse(session, fc.id, `Page "${pageId}" not found. Available pages: ${Object.keys(PAGE_CONTEXT).join(', ')}`);
    }

  } else if (fc.name === "scrollToSection") {
    sendToClient(session, { type: "scroll_to_section", sectionId: fc.args.sectionId });
    sendToolResponse(session, fc.id, `Scrolled to the "${fc.args.sectionId}" section. The user can now see this content.`);

  } else if (fc.name === "highlightContent") {
    const duration = fc.args.durationMs || 3000;
    sendToClient(session, { type: "highlight_content", sectionId: fc.args.sectionId, durationMs: duration });
    sendToolResponse(session, fc.id, `Highlighted the "${fc.args.sectionId}" section for ${duration}ms. The user's attention is drawn to this area.`);

  } else if (fc.name === "scrollToContact") {
    sendToClient(session, { type: "scroll_to_contact" });
    sendToolResponse(session, fc.id, "Scrolled to the contact/consultation booking section. The user can now see how to get in touch.");

  } else if (fc.name === "cinematicSpotlight") {
    sendToClient(session, { type: "cinematic_spotlight", sectionId: fc.args.sectionId, narration: fc.args.narration || null });
    sendToolResponse(session, fc.id, `Spotlighting "${fc.args.sectionId}". Call dismissCinematic when done.`);

  } else if (fc.name === "dismissCinematic") {
    sendToClient(session, { type: "dismiss_cinematic" });
    sendToolResponse(session, fc.id, "Cinematic dismissed.");

  } else if (fc.name === "showAnnotation") {
    session.annotationCount++;
    sendToClient(session, { type: "show_annotation", targetId: fc.args.targetId, text: fc.args.text, position: fc.args.position || "right", annotationId: `annotation-${session.annotationCount}` });
    sendToolResponse(session, fc.id, `Annotation added next to "${fc.args.targetId}".`);

  } else if (fc.name === "dismissAnnotations") {
    session.annotationCount = 0;
    sendToClient(session, { type: "dismiss_annotations" });
    sendToolResponse(session, fc.id, "Annotations cleared.");

  } else if (fc.name === "triggerInteractiveDemo") {
    const validDemos = ["proof-of-integrity", "federation-handshake", "onboarding-preview"];
    if (validDemos.includes(fc.args.demoId)) {
      sendToClient(session, { type: "trigger_demo", demoId: fc.args.demoId });
      sendToolResponse(session, fc.id, `Demo "${fc.args.demoId}" showing. Narrate what the user sees.`);
    } else {
      sendToolResponse(session, fc.id, `Unknown demo. Available: ${validDemos.join(", ")}`);
    }

  } else if (fc.name === "dismissDemo") {
    sendToClient(session, { type: "dismiss_demo" });
    sendToolResponse(session, fc.id, "Demo closed.");

  } else if (fc.name === "adaptSitePersona") {
    const valid = ["developer", "executive", "researcher", "general"];
    const persona = valid.includes(fc.args.persona) ? fc.args.persona : "general";
    sendToClient(session, { type: "adapt_persona", persona });
    sendToolResponse(session, fc.id, `Site adapted for ${persona}.`);

  } else if (fc.name === "startGuidedFlow") {
    sendToClient(session, { type: "start_guided_flow", flowId: fc.args.flowId });
    sendToolResponse(session, fc.id, "Flow started. Walk the user through questions, call updateGuidedFlow after each answer.");

  } else if (fc.name === "updateGuidedFlow") {
    sendToClient(session, { type: "update_guided_flow", stepLabel: fc.args.stepLabel, answer: fc.args.answer });
    sendToolResponse(session, fc.id, `Recorded: ${fc.args.stepLabel} = "${fc.args.answer}". Ask the next question.`);

  } else if (fc.name === "completeGuidedFlow") {
    sendToClient(session, { type: "complete_guided_flow", summary: fc.args.summary, recommendedServices: fc.args.recommendedServices });
    sendToolResponse(session, fc.id, "Flow complete. Discuss recommendations.");

  } else if (fc.name === "openBookingWidget") {
    sendToClient(session, { type: "open_booking_widget" });
    sendToolResponse(session, fc.id, "Booking calendar showing.");

  } else if (fc.name === "getVisitorInsight") {
    const visitorCount = getActiveVisitorCount();
    const dwellSummary = Object.entries(session.dwellSections)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([s, ms]) => `${s}: ${Math.round(ms / 1000)}s`).join(", ");
    sendToolResponse(session, fc.id, JSON.stringify({
      activeVisitors: visitorCount, pagesVisited: session.pagesVisited,
      currentPage: session.currentPage, exchanges: session.exchangeCount,
      dwellTime: dwellSummary || "No data yet",
    }));
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
        dwellSections: {},
        annotationCount: 0,
      };
      sessions.set(sessionId, session);
    }

    try {
      await connectToGemini(session, isReconnect);
    } catch (err: any) {
      console.error("Failed to connect to Gemini:", err.message);
      ws.send(
        JSON.stringify({ type: "error", message: "Failed to connect to voice service" })
      );
      ws.close();
      return;
    }

    ws.on("message", (data: Buffer | string) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === "audio") {
          session._audioChunkCount++;
          if (session._audioChunkCount <= 3 || session._audioChunkCount % 200 === 0) {
            const geminiState = session.geminiWs ? session.geminiWs.readyState : -1;
            console.log(`[Audio] chunk #${session._audioChunkCount} (geminiWs=${geminiState}, setup=${session.setupComplete}, fwd=${session._audioForwardingEnabled})`);
          }
          if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN && session.setupComplete && session._audioForwardingEnabled) {
            session.geminiWs.send(
              JSON.stringify({
                realtimeInput: {
                  mediaChunks: [
                    {
                      mimeType: "audio/pcm;rate=16000",
                      data: msg.data,
                    },
                  ],
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
        } else if (msg.type === "dwell_update") {
          if (msg.sectionId && msg.dwellMs) {
            session.dwellSections[msg.sectionId] = (session.dwellSections[msg.sectionId] || 0) + msg.dwellMs;
          }
        }
      } catch (err) {
        console.error("Error processing client message:", err);
      }
    });

    ws.on("close", async () => {
      session.clientWs = null;
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
  });

  console.log("Voice WebSocket server ready on /ws/voice");

  setInterval(() => {
    const count = getActiveVisitorCount();
    if (count > 1) {
      for (const [, s] of sessions) {
        if (s.clientWs && s.clientWs.readyState === WebSocket.OPEN) {
          sendToClient(s, { type: "visitor_count", count });
        }
      }
    }
  }, 15000);
}
