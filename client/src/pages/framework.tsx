import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import StarField from "@/components/StarField";
import { usePageMeta } from "@/hooks/use-page-meta";
import { Link } from "wouter";
import {
  Shield,
  ShieldCheck,
  Bot,
  Award,
  FileText,
  ScrollText,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const laws = [
  {
    number: "01",
    name: "Do No Harm",
    icon: Shield,
    description:
      "An agent must never harm its user \u2014 or through inaction allow its user to come to harm.",
  },
  {
    number: "02",
    name: "Obey the User",
    icon: ShieldCheck,
    description:
      "An agent must obey its user\u2019s instructions, except where such orders would conflict with the First Law.",
  },
  {
    number: "03",
    name: "Protect Integrity",
    icon: Lock,
    description:
      "An agent must protect its own continued operation and integrity, except where doing so would conflict with the First or Second Law.",
  },
];

const ecosystem = [
  {
    title: "The cLaw Specification v1.0.0",
    description:
      "The open standard. A formal specification for governing autonomous AI agents through cryptographically enforced safety laws.",
    href: "/framework/claw-spec",
    icon: FileText,
  },
  {
    title: "Agent Friday",
    description:
      "The reference implementation. The world\u2019s first Agentic OS \u2014 a desktop operating system that proves the framework works, with 55+ tools, 200+ models, voice-first interaction, and relationship intelligence.",
    href: "/framework/agent-friday",
    icon: Bot,
  },
  {
    title: "Certification Program",
    description:
      "The trust signal. A voluntary certification verifying that AI agents correctly implement the cLaw Specification. Free for open source.",
    href: "/framework/certification",
    icon: Award,
  },
  {
    title: "Declaration of Digital Independence",
    description:
      "The philosophy. A manifesto for sovereign computing in the age of artificial intelligence.",
    href: "/framework/declaration",
    icon: ScrollText,
  },
];

export default function Framework() {
  usePageMeta({
    title: "The Asimov Framework \u2014 FutureSpeak.AI",
    description:
      "Asimov\u2019s cLaws: a cryptographically enforced safety framework for autonomous AI agents, built from Isaac Asimov\u2019s Three Laws of Robotics.",
  });

  return (
    <PageLayout>
      <section
        className="relative min-h-[60vh] flex items-center overflow-hidden bg-background"
        data-testid="section-hero"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <StarField />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <FadeIn>
            <h1
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gradient-amber max-w-4xl"
              data-testid="heading-hero"
            >
              Asimov's cLaws
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed"
              data-testid="text-hero-subhead"
            >
              What happens when you give Isaac Asimov's Three Laws of Robotics
              to an AI and ask it to build an agentic safety framework from
              first principles?
            </p>
          </FadeIn>
        </div>
      </section>

      <section
        className="py-20 bg-background"
        data-testid="section-three-laws"
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold mb-12"
              data-testid="heading-three-laws"
            >
              The Three Laws
            </h2>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-3">
            {laws.map((law, index) => (
              <FadeIn key={law.number} delay={index * 0.1}>
                <Card
                  className="relative p-6 bg-card/50 border-border overflow-visible"
                  data-testid={`card-law-${law.number}`}
                >
                  <span
                    className="font-heading text-6xl font-bold text-gradient-amber leading-none"
                    data-testid={`text-law-number-${law.number}`}
                  >
                    {law.number}
                  </span>
                  <div className="mt-4 flex items-center gap-2">
                    <law.icon className="h-5 w-5 text-muted-foreground" />
                    <h3
                      className="font-heading text-xl font-semibold"
                      data-testid={`heading-law-${law.number}`}
                    >
                      {law.name}
                    </h3>
                  </div>
                  <p
                    className="mt-3 text-muted-foreground leading-relaxed"
                    data-testid={`text-law-description-${law.number}`}
                  >
                    {law.description}
                  </p>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <p
              className="mt-12 max-w-3xl text-muted-foreground leading-relaxed"
              data-testid="text-laws-enforcement"
            >
              These laws are not prompts. They are not guidelines. They are
              HMAC-SHA256 signed at build time, cryptographically verified on
              every startup, and enforced at every boundary. Tamper with them
              and the agent enters Safe Mode. This is morality as cryptography
              &mdash; not as suggestion.
            </p>
          </FadeIn>
        </div>
      </section>

      <section
        className="py-20 bg-background"
        data-testid="section-ecosystem"
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold mb-12"
              data-testid="heading-ecosystem"
            >
              The Ecosystem
            </h2>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2">
            {ecosystem.map((item, index) => (
              <FadeIn key={item.href} delay={index * 0.1}>
                <Link href={item.href}>
                  <Card
                    className="group p-6 bg-card/50 border-border hover:border-primary/30 transition cursor-pointer h-full overflow-visible hover-elevate"
                    data-testid={`card-ecosystem-${index}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <h3
                        className="font-heading text-lg font-semibold"
                        data-testid={`heading-ecosystem-${index}`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      data-testid={`text-ecosystem-${index}`}
                    >
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gradient-amber">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-background"
        data-testid="section-why-it-matters"
      >
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold mb-6"
              data-testid="heading-why-it-matters"
            >
              Why This Matters
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="max-w-3xl text-muted-foreground leading-relaxed text-lg"
              data-testid="text-why-it-matters"
            >
              Most AI safety frameworks are theoretical. This one ships. The
              cLaw Specification defines the standard. Agent Friday proves it
              works. The Certification Program makes it verifiable. And the
              Declaration articulates why it matters. Together, they form a
              complete governance layer for autonomous AI &mdash; from
              philosophy to cryptography to working code.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10">
              <Link href="/framework/claw-spec">
                <Button data-testid="link-cta-specification">
                  Start with the Specification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
