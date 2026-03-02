import PageLayout from "@/components/PageLayout";
import StarField from "@/components/StarField";
import FadeIn from "@/components/FadeIn";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import { Shield, Bot, Building2, ArrowRight } from "lucide-react";

export default function Home() {
  usePageMeta({
    title: "FutureSpeak.AI — The Governance Layer for Autonomous AI",
    description:
      "FutureSpeak.AI created the cLaw Specification — an open standard for cryptographically enforced AI agent safety — and Agent Friday, the reference implementation that proves it works.",
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
              The Governance Layer for{" "}
              <span className="text-gradient-amber">Autonomous AI</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
              data-testid="text-hero-subhead"
            >
              FutureSpeak.AI created the cLaw Specification — an open standard
              for cryptographically enforced AI agent safety — and Agent Friday,
              the reference implementation that proves it works.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/framework"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md transition-colors"
                data-testid="link-developer-cta"
              >
                I'm a Developer
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/consulting"
                className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-md backdrop-blur-sm bg-background/20 transition-colors hover:border-primary/50"
                data-testid="link-enterprise-cta"
              >
                I Need Enterprise AI
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        className="py-24"
        data-testid="section-cards"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <Link href="/framework/claw-spec" data-testid="link-card-claw-spec">
                <div className="glass-panel rounded-xl border border-border bg-card/50 p-8 h-full transition-all duration-300 hover:border-primary/30 hover:glow-amber group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3
                    className="font-heading text-xl font-semibold text-foreground mb-3"
                    data-testid="text-card-title-claw"
                  >
                    The cLaw Specification
                  </h3>
                  <p
                    className="text-muted-foreground leading-relaxed mb-4"
                    data-testid="text-card-desc-claw"
                  >
                    An open standard for governing autonomous AI agents through
                    cryptographically enforced safety laws. Morality as
                    architecture, not marketing.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-gradient-cyan font-medium group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 text-accent" />
                  </span>
                </div>
              </Link>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Link href="/framework/agent-friday" data-testid="link-card-agent-friday">
                <div className="glass-panel rounded-xl border border-border bg-card/50 p-8 h-full transition-all duration-300 hover:border-primary/30 hover:glow-amber group">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5">
                    <Bot className="w-6 h-6 text-accent" />
                  </div>
                  <h3
                    className="font-heading text-xl font-semibold text-foreground mb-3"
                    data-testid="text-card-title-friday"
                  >
                    Agent Friday
                  </h3>
                  <p
                    className="text-muted-foreground leading-relaxed mb-4"
                    data-testid="text-card-desc-friday"
                  >
                    The world's first Agentic OS — a desktop operating system
                    governed by Asimov's cLaws. Multi-model, voice-first, fully
                    local. Free and open source.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-gradient-cyan font-medium group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 text-accent" />
                  </span>
                </div>
              </Link>
            </FadeIn>

            <FadeIn delay={0.3}>
              <Link href="/consulting" data-testid="link-card-consulting">
                <div className="glass-panel rounded-xl border border-border bg-card/50 p-8 h-full transition-all duration-300 hover:border-primary/30 hover:glow-amber group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3
                    className="font-heading text-xl font-semibold text-foreground mb-3"
                    data-testid="text-card-title-consulting"
                  >
                    Enterprise Consulting
                  </h3>
                  <p
                    className="text-muted-foreground leading-relaxed mb-4"
                    data-testid="text-card-desc-consulting"
                  >
                    AI strategy from the team that trained Google Gemini. Agentic
                    workflows, RAG architectures, and compliance frameworks for
                    Fortune 500 companies.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-gradient-cyan font-medium group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4 text-accent" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <section
        className="py-16 border-t border-border"
        data-testid="section-credibility"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col items-center gap-4 text-center">
              <p
                className="text-sm text-muted-foreground tracking-wide"
                data-testid="text-models-trained"
              >
                <span className="text-foreground/70 font-medium">
                  Models trained:
                </span>{" "}
                Google Gemini · Meta LLaMA 3 · Amazon Alexa
              </p>
              <div className="w-16 h-px bg-border" />
              <p
                className="text-sm text-muted-foreground tracking-wide"
                data-testid="text-enterprise-clients"
              >
                <span className="text-foreground/70 font-medium">
                  Enterprise clients:
                </span>{" "}
                Sanofi · Merck · GM · Microsoft
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
