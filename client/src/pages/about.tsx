import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import { usePageMeta } from "@/hooks/use-page-meta";
import profilePhoto from "@assets/1760623171257_1771883927684.jpg";
import { Github, ExternalLink } from "lucide-react";
import { SiLinkedin, SiDiscord } from "react-icons/si";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const bioBlocks = [
  {
    id: "frontier-ai",
    category: "Frontier AI",
    description:
      "Trained Google Gemini (including during the 2024 election cycle), Meta LLaMA 3, Amazon Alexa. Developed response frameworks for politically sensitive queries at Google scale.",
  },
  {
    id: "enterprise-ai",
    category: "Enterprise AI",
    description:
      "Senior Director of Integrated Intelligence at Aquent Studios. AI strategy and implementation for Fortune 500 clients in regulated industries. Created SAGE, generating \u20AC120M in projected savings.",
  },
  {
    id: "futurespeak",
    category: "FutureSpeak.AI",
    description:
      "Founded consultancy connecting businesses with AI transformation. Clients include The Motley Fool, Kunai (fintech), INNEX Energy. Created the cLaw Specification, Agent Friday, and the Asimov Agent Certification Program.",
  },
  {
    id: "journalism",
    category: "Journalism",
    description:
      "20+ years. Editor-in-Chief at Raw Story (grew from 50K to 5M monthly readers). Founded Austin.com. Led digital transformation at The Progressive. Work cited by NYT, Washington Post, Wired, Rolling Stone. Original reporting inspired a documentary that premiered at Sundance 2025.",
  },
];

const citedBy = [
  "NYT",
  "Washington Post",
  "Wired",
  "Rolling Stone",
  "Playboy",
  "High Times",
  "UK Parliament",
  "ACLU Federal Litigation",
  "Project Censored",
];

export default function About() {
  usePageMeta({
    title: "About Stephen C. Webster \u2014 FutureSpeak.AI",
    description:
      "Stephen C. Webster is the Principal Architect of FutureSpeak.AI, creator of the cLaw Specification and Agent Friday.",
  });

  return (
    <PageLayout>
      <section className="py-20" data-testid="section-opening">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <p
              className="max-w-3xl mx-auto text-xl leading-relaxed text-center"
              data-testid="text-opening-narrative"
            >
              Most AI safety frameworks are written by researchers. This one was
              written by someone who trained Google Gemini, deployed AI for
              Fortune 500 pharma clients, and spent 20 years as an investigative
              journalist asking who has the power and what they're doing with it.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-profile">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          <FadeIn>
            <img
              src={profilePhoto}
              alt="Stephen C. Webster"
              className="w-32 h-32 rounded-full object-cover border-2 border-primary/30"
              data-testid="img-profile-photo"
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1
              className="font-heading text-3xl mt-6"
              data-testid="text-name"
            >
              Stephen C. Webster
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="text-muted-foreground mt-2"
              data-testid="text-title"
            >
              Principal Architect, FutureSpeak.AI
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-bio">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          {bioBlocks.map((block, index) => (
            <FadeIn key={block.id} delay={index * 0.1}>
              <div
                className="border-l-2 border-primary/30 pl-6"
                data-testid={`bio-block-${block.id}`}
              >
                <span
                  className="text-primary text-sm uppercase tracking-wider"
                  data-testid={`text-category-${block.id}`}
                >
                  {block.category}
                </span>
                <p
                  className="mt-2 text-muted-foreground leading-relaxed"
                  data-testid={`text-description-${block.id}`}
                >
                  {block.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="py-20" data-testid="section-cited-by">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <h2
              className="text-sm uppercase tracking-wider text-muted-foreground mb-4 text-center"
              data-testid="text-cited-by-heading"
            >
              Cited By
            </h2>
            <div
              className="flex flex-wrap justify-center gap-2"
              data-testid="list-cited-by"
            >
              {citedBy.map((outlet) => (
                <Badge
                  key={outlet}
                  variant="secondary"
                  className="no-default-hover-elevate no-default-active-elevate"
                  data-testid={`badge-cited-${outlet.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {outlet}
                </Badge>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-asimov">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn>
            <div
              className="bg-card/30 border border-border rounded-xl p-8"
              data-testid="card-asimov-tribute"
            >
              <h2
                className="font-serif text-2xl mb-4"
                data-testid="text-asimov-heading"
              >
                A Note on Isaac Asimov
              </h2>
              <p
                className="font-serif text-muted-foreground leading-relaxed"
                data-testid="text-asimov-content"
              >
                Isaac Asimov published his Three Laws of Robotics in 1942 — not
                as engineering specifications, but as storytelling devices
                designed to explore the unintended consequences of seemingly
                simple rules. For more than 80 years, these laws lived only in
                fiction. The cLaw Specification is our attempt to give them a
                real engineering foundation: cryptographic enforcement, formal
                verification, and working code. Asimov understood something that
                most AI safety researchers are still catching up to — that the
                interesting problems aren't in the laws themselves, but in the
                conflicts between them. Every story he wrote about robots was
                really about the edge cases. We built Agent Friday to handle
                those edge cases in production. This work is dedicated to his
                memory and to the radical idea that safety and capability are not
                opposing forces.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-links">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-4">
          <FadeIn delay={0}>
            <Button variant="outline" asChild data-testid="link-github">
              <a
                href="https://github.com/stephenwebster"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Button variant="outline" asChild data-testid="link-linkedin">
              <a
                href="https://linkedin.com/in/stephenwebster"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiLinkedin className="mr-2 h-4 w-4" />
                LinkedIn
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Button variant="outline" asChild data-testid="link-discord">
              <a
                href="https://discord.gg/futurespeak"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiDiscord className="mr-2 h-4 w-4" />
                Discord
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
