import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import StarField from "@/components/StarField";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import {
  Download,
  Github,
  Lock,
  Users,
  Palette,
  Music,
  Mic,
  Eye,
  UsersRound,
  Brain,
  Code,
  Mail,
  Calendar,
  Globe,
  FileText,
  Wrench,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const differentiators = [
  {
    icon: Lock,
    title: "Morality as Cryptography",
    description:
      "The Three cLaws are HMAC-SHA256 signed at build time and verified on every startup. If tampered with, Friday enters Safe Mode and refuses to operate. These aren't guidelines — they're tamper-evident structural constraints.",
  },
  {
    icon: Users,
    title: "Relationship Intelligence",
    description:
      "Friday builds a Relationship Graph of your professional world — up to 200 profiles with contextual notes. Every email draft, meeting brief, and recommendation is informed by real relationship context. Trust isn't accumulated linearly — every new observation triggers a full recomputation through hermeneutic re-evaluation.",
  },
  {
    icon: Palette,
    title: "A Personality That Evolves",
    description:
      "Friday's personality is an 8-layer composition rebuilt for every interaction. The 3D desktop visualization directly expresses the agent's traits — warm agents drift toward amber, analytical agents shift toward cyan. After months of use, no two Fridays look alike.",
  },
  {
    icon: Music,
    title: "Multi-Model Orchestra",
    description:
      "Not one AI — an orchestra. Gemini for voice and vision. Claude for deep reasoning. Perplexity for search. OpenAI for math. 200+ models via OpenRouter. ElevenLabs for cinema-quality voices. Each chosen for what it does best, all governed by the cLaws.",
  },
];

const capabilities = [
  { icon: Mic, title: "Voice-First Interaction", description: "Natural conversations with cinema-quality voice synthesis" },
  { icon: Eye, title: "Screen Vision & Desktop Control", description: "See your screen, click, type, and navigate autonomously" },
  { icon: UsersRound, title: "Parallel Agent Teams", description: "Multiple specialized agents working together simultaneously" },
  { icon: Brain, title: "Persistent Memory", description: "Three-tier memory system: working, episodic, and semantic" },
  { icon: Code, title: "On-the-Fly Code Generation", description: "Generate, execute, and iterate on code in real-time" },
  { icon: Mail, title: "Communications Intelligence", description: "Draft emails and messages with relationship context" },
  { icon: Calendar, title: "Meeting Intelligence", description: "Real-time transcription, summarization, and follow-ups" },
  { icon: Globe, title: "Browser & Web Automation", description: "Navigate, search, and extract data from the web" },
  { icon: FileText, title: "Document Intelligence", description: "PageIndex: process and understand any document format" },
  { icon: Wrench, title: "Self-Improvement", description: "User-approved enhancements to its own capabilities" },
  { icon: Clock, title: "Scheduled Tasks & Workflows", description: "Automated routines and multi-step workflows" },
  { icon: Zap, title: "55+ Tools from 12+ Sources", description: "Extensible tool ecosystem with verified integrations" },
];

const standaloneLibraries = [
  { name: "trust-graph-engine", url: "https://github.com/FutureSpeakAI/trust-graph-engine" },
  { name: "cognitive-memory", url: "https://github.com/FutureSpeakAI/cognitive-memory" },
  { name: "agent-integrity", url: "https://github.com/FutureSpeakAI/agent-integrity" },
  { name: "personality-evolution", url: "https://github.com/FutureSpeakAI/personality-evolution" },
  { name: "predictive-agent", url: "https://github.com/FutureSpeakAI/predictive-agent" },
  { name: "self-improving-agent", url: "https://github.com/FutureSpeakAI/self-improving-agent" },
  { name: "meeting-intelligence", url: "https://github.com/FutureSpeakAI/meeting-intelligence" },
];

const customizedForks = [
  { name: "World Monitor", url: "https://github.com/FutureSpeakAI/world-monitor" },
  { name: "PageIndex", url: "https://github.com/FutureSpeakAI/pageindex" },
  { name: "Pixel Agents", url: "https://github.com/FutureSpeakAI/pixel-agents" },
  { name: "OpenClaw", url: "https://github.com/FutureSpeakAI/openclaw" },
  { name: "Self-Operating Computer", url: "https://github.com/FutureSpeakAI/self-operating-computer" },
  { name: "Browser Use", url: "https://github.com/FutureSpeakAI/browser-use" },
];

export default function AgentFriday() {
  usePageMeta({
    title: "Agent Friday — The World's First Agentic OS | FutureSpeak.AI",
    description:
      "Agent Friday is the world's first Agentic OS — a voice-first, multi-model, fully local desktop operating system. The reference implementation of the cLaw Specification.",
  });

  return (
    <PageLayout>
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        data-testid="section-hero"
      >
        <StarField />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
              data-testid="text-hero-headline"
            >
              Agent Friday
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
              data-testid="text-hero-subhead"
            >
              The world's first Agentic OS — a desktop operating system with a
              heart. Voice-first, multi-model, fully local. The reference
              implementation of the cLaw Specification.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/FutureSpeakAI/agent-friday/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md transition-colors"
                data-testid="link-download"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <a
                href="https://github.com/FutureSpeakAI/agent-friday"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-background/50 backdrop-blur text-foreground font-medium px-6 py-3 rounded-md transition-colors"
                data-testid="link-source-code"
              >
                <Github className="w-4 h-4" />
                Source Code
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p
              className="text-muted-foreground text-sm mt-4"
              data-testid="text-free-note"
            >
              100% Free — Bring Your Own API Keys
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-differentiators">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-12"
              data-testid="text-differentiators-heading"
            >
              What Makes It Different
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div
                  className="bg-card border border-border rounded-lg p-6"
                  data-testid={`card-differentiator-${index}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-md bg-primary/10">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3
                      className="font-heading text-lg font-semibold text-foreground"
                      data-testid={`text-differentiator-title-${index}`}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p
                    className="text-muted-foreground leading-relaxed"
                    data-testid={`text-differentiator-desc-${index}`}
                  >
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-12"
              data-testid="text-capabilities-heading"
            >
              The Full Picture
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {capabilities.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <div
                  className="bg-card/30 border border-border/50 rounded-lg p-4"
                  data-testid={`card-capability-${index}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <h3
                      className="font-heading text-sm font-semibold text-foreground"
                      data-testid={`text-capability-title-${index}`}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <p
                    className="text-muted-foreground text-sm leading-relaxed"
                    data-testid={`text-capability-desc-${index}`}
                  >
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-ecosystem">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-4"
              data-testid="text-ecosystem-heading"
            >
              Open Source Ecosystem
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed"
              data-testid="text-ecosystem-intro"
            >
              Agent Friday isn't a monolith. Our original subsystems have been
              extracted into standalone libraries.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.15}>
              <div
                className="bg-card border border-border rounded-lg p-6"
                data-testid="card-standalone-libraries"
              >
                <h3
                  className="font-heading text-lg font-semibold text-foreground mb-4"
                  data-testid="text-standalone-heading"
                >
                  Standalone Libraries
                </h3>
                <ul className="space-y-2">
                  {standaloneLibraries.map((lib, index) => (
                    <li key={lib.name}>
                      <a
                        href={lib.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        data-testid={`link-library-${index}`}
                      >
                        <Github className="w-3.5 h-3.5" />
                        {lib.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div
                className="bg-card border border-border rounded-lg p-6"
                data-testid="card-customized-forks"
              >
                <h3
                  className="font-heading text-lg font-semibold text-foreground mb-4"
                  data-testid="text-forks-heading"
                >
                  Customized Forks
                </h3>
                <ul className="space-y-2">
                  {customizedForks.map((fork, index) => (
                    <li key={fork.name}>
                      <a
                        href={fork.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        data-testid={`link-fork-${index}`}
                      >
                        <Github className="w-3.5 h-3.5" />
                        {fork.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-8"
              data-testid="text-cta-heading"
            >
              Get Involved
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href="https://github.com/FutureSpeakAI/agent-friday"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md transition-colors"
                data-testid="link-cta-github"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://discord.gg/futurespeak"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-background/50 backdrop-blur text-foreground font-medium px-6 py-3 rounded-md transition-colors"
                data-testid="link-cta-discord"
              >
                Discord
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link
              href="/framework/claw-spec"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              data-testid="link-cta-claw-spec"
            >
              Read the cLaw Specification
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
