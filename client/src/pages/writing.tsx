import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import { usePageMeta } from "@/hooks/use-page-meta";
import { PenLine, ExternalLink, Clock } from "lucide-react";

const placeholderArticles = [
  {
    id: "governance-layer",
    title: "Why AI Needs a Governance Layer",
    description: "The case for cryptographically enforced safety in autonomous AI systems.",
    category: "AI Governance",
  },
  {
    id: "morality-cryptography",
    title: "Morality as Cryptography",
    description: "How the cLaw Specification transforms ethical guidelines into tamper-evident constraints.",
    category: "cLaw Specification",
  },
  {
    id: "agentic-future",
    title: "The Agentic Future",
    description: "What happens when AI agents can act autonomously — and why governance matters more than capability.",
    category: "Enterprise AI",
  },
];

export default function Writing() {
  usePageMeta({
    title: "Writing — FutureSpeak.AI",
    description: "Thoughts on AI governance, agent safety, enterprise AI, and building things that matter.",
  });

  return (
    <PageLayout>
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h1 data-testid="text-writing-title" className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Writing
              </h1>
              <p data-testid="text-writing-subtitle" className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Thoughts on AI governance, agent safety, enterprise AI, and building things that matter.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex items-center justify-center gap-2 mb-16 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span data-testid="text-coming-soon" className="text-sm">Coming soon</span>
            </div>
          </FadeIn>

          <div className="space-y-6">
            {placeholderArticles.map((article, index) => (
              <FadeIn key={article.id} delay={0.1 * (index + 1)}>
                <article
                  data-testid={`card-article-${article.id}`}
                  className="group rounded-xl border border-border bg-card/50 p-6 sm:p-8 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-medium text-primary uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h2 className="font-heading text-xl font-semibold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {article.description}
                      </p>
                    </div>
                    <PenLine className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-1" />
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                For existing thought leadership, visit Stephen's LinkedIn.
              </p>
              <a
                href="https://linkedin.com/in/stephencwebster"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-linkedin-writing"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View on LinkedIn
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
