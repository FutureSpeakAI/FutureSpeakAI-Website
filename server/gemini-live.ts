import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { storage } from "./storage";

const GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const MODEL = "models/gemini-2.5-flash-native-audio-thinking";

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

KNOWLEDGE BASE:
${SITE_CONTEXT}
`;

interface VoiceSession {
  sessionId: string;
  userName: string | null;
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
}

const sessions = new Map<string, VoiceSession>();

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.lastActiveAt.getTime() > 24 * 60 * 60 * 1000) {
      if (session.geminiWs) session.geminiWs.close();
      sessions.delete(id);
    }
  }
}, 60 * 60 * 1000);

function buildSystemInstruction(session: VoiceSession, isReconnect: boolean): string {
  let instruction = SYSTEM_INSTRUCTION_BASE;

  let stepBehavior = "";
  if (!session.nameAsked && session.exchangeCount < 3) {
    stepBehavior += "- After 2-3 exchanges with the user, naturally and warmly ask for their name. For example: 'By the way, I'd love to know who I'm talking to — what's your name?' When they tell you their name, immediately call the saveUserName function with their name.\n";
  }
  if (session.userName && !session.emailAsked) {
    stepBehavior += `- The user's name is "${session.userName}". Use it occasionally to be personal.\n`;
    stepBehavior += "- After about 8-10 total exchanges, naturally ask if they'd like to sign up for email updates from FutureSpeak.AI. If they say yes, ask: 'Would you like to just tell me your email address, or would you prefer to type it out?' If they want to tell you, ask for their email and then call the saveEmailSubscriber function. If they want to type, call the showEmailSignupPopup function.\n";
  } else if (session.userName) {
    stepBehavior += `- The user's name is "${session.userName}". Use it occasionally.\n`;
  }
  if (session.emailCollected) {
    stepBehavior += "- The user has already signed up for emails. Do not ask again.\n";
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
                  parameters: {
                    type: "OBJECT",
                    properties: {},
                  },
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
          if (session.clientWs && session.clientWs.readyState === WebSocket.OPEN) {
            session.clientWs.send(
              JSON.stringify({
                type: "setup_complete",
                sessionId: session.sessionId,
                isReconnect,
              })
            );
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
                if (
                  session.clientWs &&
                  session.clientWs.readyState === WebSocket.OPEN
                ) {
                  session.clientWs.send(
                    JSON.stringify({
                      type: "audio",
                      data: part.inlineData.data,
                      mimeType: part.inlineData.mimeType,
                    })
                  );
                }
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
            if (
              session.clientWs &&
              session.clientWs.readyState === WebSocket.OPEN
            ) {
              session.clientWs.send(JSON.stringify({ type: "turn_complete" }));
            }
          }

          if (sc.interrupted) {
            session.isModelSpeaking = false;
            if (
              session.clientWs &&
              session.clientWs.readyState === WebSocket.OPEN
            ) {
              session.clientWs.send(JSON.stringify({ type: "interrupted" }));
            }
          }
        }

        if (msg.serverContent?.inputTranscript) {
          session.conversationHistory.push({
            role: "User",
            text: msg.serverContent.inputTranscript,
          });
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
        }

        if (msg.toolCall) {
          for (const fc of msg.toolCall.functionCalls) {
            if (fc.name === "saveUserName") {
              session.userName = fc.args.name;
              session.nameAsked = true;
              if (
                session.clientWs &&
                session.clientWs.readyState === WebSocket.OPEN
              ) {
                session.clientWs.send(
                  JSON.stringify({ type: "name_saved", name: fc.args.name })
                );
              }
              if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
                session.geminiWs.send(
                  JSON.stringify({
                    toolResponse: {
                      functionResponses: [
                        {
                          response: {
                            result: `Name saved as "${fc.args.name}". Use their name naturally in conversation going forward.`,
                          },
                          id: fc.id,
                        },
                      ],
                    },
                  })
                );
              }
            } else if (fc.name === "showEmailSignupPopup") {
              session.emailAsked = true;
              if (
                session.clientWs &&
                session.clientWs.readyState === WebSocket.OPEN
              ) {
                session.clientWs.send(
                  JSON.stringify({ type: "show_email_popup" })
                );
              }
              if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
                session.geminiWs.send(
                  JSON.stringify({
                    toolResponse: {
                      functionResponses: [
                        {
                          response: {
                            result:
                              "Email signup popup is now showing on the user's screen. Wait for them to fill it out.",
                          },
                          id: fc.id,
                        },
                      ],
                    },
                  })
                );
              }
            } else if (fc.name === "saveEmailSubscriber") {
              session.emailAsked = true;
              try {
                await storage.createEmailSubscriber({
                  name: fc.args.name || session.userName || "Unknown",
                  email: fc.args.email,
                  source: "voice_agent",
                });
                session.emailCollected = true;

                if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
                  session.geminiWs.send(
                    JSON.stringify({
                      toolResponse: {
                        functionResponses: [
                          {
                            response: {
                              result:
                                "Successfully saved the user's email subscription. Confirm to the user that they're signed up and ask if they'd like to continue exploring the ideas.",
                            },
                            id: fc.id,
                          },
                        ],
                      },
                    })
                  );
                }

                if (
                  session.clientWs &&
                  session.clientWs.readyState === WebSocket.OPEN
                ) {
                  session.clientWs.send(
                    JSON.stringify({
                      type: "email_saved",
                      name: fc.args.name,
                      email: fc.args.email,
                    })
                  );
                }
              } catch (err) {
                console.error("Failed to save email subscriber:", err);
                if (session.geminiWs && session.geminiWs.readyState === WebSocket.OPEN) {
                  session.geminiWs.send(
                    JSON.stringify({
                      toolResponse: {
                        functionResponses: [
                          {
                            response: {
                              result:
                                "There was an error saving the email. Apologize briefly and move on.",
                            },
                            id: fc.id,
                          },
                        ],
                      },
                    })
                  );
                }
              }
            }
          }
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
      console.log(`Gemini WS closed: ${code} ${reason.toString()}`);
      session.geminiWs = null;
      session.setupComplete = false;
      if (
        session.clientWs &&
        session.clientWs.readyState === WebSocket.OPEN
      ) {
        session.clientWs.send(
          JSON.stringify({
            type: "gemini_disconnected",
            reason: "session_ended",
          })
        );
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

export function setupVoiceWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws/voice" });

  wss.on("connection", async (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const sessionId = url.searchParams.get("sessionId") || crypto.randomUUID();
    const userName = url.searchParams.get("userName") || null;

    const existingSession = sessions.get(sessionId);
    const isReconnect = !!existingSession;

    let session: VoiceSession;
    if (existingSession) {
      session = existingSession;
      session.clientWs = ws;
      session.lastActiveAt = new Date();
      if (userName && !session.userName) session.userName = userName;
      if (session.geminiWs) {
        session.geminiWs.close();
        session.geminiWs = null;
      }
    } else {
      session = {
        sessionId,
        userName,
        exchangeCount: 0,
        nameAsked: false,
        emailAsked: false,
        emailCollected: false,
        conversationHistory: [],
        lastActiveAt: new Date(),
        geminiWs: null,
        clientWs: ws,
        isModelSpeaking: false,
        setupComplete: false,
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
          if (
            session.geminiWs &&
            session.geminiWs.readyState === WebSocket.OPEN &&
            session.setupComplete
          ) {
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
          if (
            session.geminiWs &&
            session.geminiWs.readyState === WebSocket.OPEN
          ) {
            session.geminiWs.send(
              JSON.stringify({
                clientContent: {
                  turns: [
                    {
                      role: "user",
                      parts: [
                        {
                          text: "I just submitted my email through the form on the screen.",
                        },
                      ],
                    },
                  ],
                  turnComplete: true,
                },
              })
            );
          }
        } else if (msg.type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
          session.lastActiveAt = new Date();
        }
      } catch (err) {
        console.error("Error processing client message:", err);
      }
    });

    ws.on("close", () => {
      session.clientWs = null;
      if (session.geminiWs) {
        session.geminiWs.close();
        session.geminiWs = null;
      }
    });

    ws.on("error", (err) => {
      console.error("Client WebSocket error:", err.message);
    });
  });

  console.log("Voice WebSocket server ready on /ws/voice");
}
