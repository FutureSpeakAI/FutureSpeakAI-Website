import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, ShieldCheck, Crown, ArrowRight, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const certificationLevels = [
  {
    name: "Core",
    icon: Shield,
    description:
      "Validates fundamental cLaw compliance \u2014 cryptographic law enforcement, identity management, and safe mode behavior. Required foundation for all certified agents.",
    priceOpen: "Free for open source",
    priceCommercial: "$500 for commercial",
    cardClass: "bg-card border border-border",
  },
  {
    name: "Connected",
    icon: ShieldCheck,
    description:
      "Extends Core with inter-agent communication verification, attestation protocol compliance, and peer trust validation.",
    priceOpen: "Free for open source",
    priceCommercial: "$1,500 for commercial",
    cardClass: "bg-card border border-accent/30",
  },
  {
    name: "Sovereign",
    icon: Crown,
    description:
      "The highest level. Full specification compliance including data protection, advanced governance, and autonomous operation safety.",
    priceOpen: "Free for open source",
    priceCommercial: "$5,000 for commercial",
    cardClass: "bg-card border border-primary/30 shadow-[0_0_30px_-5px] shadow-amber-500/20",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Submit Application",
    description:
      "Provide your agent details, GitHub repository, and target certification level.",
  },
  {
    step: 2,
    title: "Automated Testing",
    description:
      "Our test suite validates your implementation against the cLaw Specification requirements.",
  },
  {
    step: 3,
    title: "Manual Review",
    description:
      "Expert reviewers assess edge cases, documentation, and governance implementation.",
  },
  {
    step: 4,
    title: "Certification Issued",
    description:
      "Receive your certification badge, attestation certificate, and listing in the certified agents registry.",
  },
];

const faqItems = [
  {
    q: "Is certification required to use the cLaw Specification?",
    a: "No. The specification is open and free. Certification is voluntary and provides independent verification.",
  },
  {
    q: "How long does certification take?",
    a: "Typically 2-4 weeks from application to certification, depending on complexity.",
  },
  {
    q: "Can I certify a commercial agent?",
    a: "Yes. Commercial certification includes the same rigorous testing with additional enterprise support.",
  },
  {
    q: "What happens when the specification is updated?",
    a: "Certified agents are given a grace period to update their implementations. Re-certification is streamlined for existing holders.",
  },
  {
    q: "Is the certification process itself open source?",
    a: "The test suites and criteria are publicly available. The review process is documented and transparent.",
  },
];

export default function Certification() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [certLevel, setCertLevel] = useState("Core");
  const [message, setMessage] = useState("");

  usePageMeta({
    title: "Asimov Agent Certification Program \u2014 FutureSpeak.AI",
    description:
      "A voluntary certification verifying that AI agents correctly implement the cLaw Specification. Free for open source.",
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      organization: string;
      githubRepo: string;
      certificationLevel: string;
      message: string;
    }) => {
      await apiRequest("POST", "/api/certification-inquiry", data);
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "We'll review your certification application and get back to you soon.",
      });
      setName("");
      setEmail("");
      setOrganization("");
      setGithubRepo("");
      setCertLevel("Core");
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      name,
      email,
      organization,
      githubRepo,
      certificationLevel: certLevel,
      message,
    });
  }

  return (
    <PageLayout>
      <section className="py-20" data-testid="section-hero">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h1
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
              data-testid="text-hero-title"
            >
              Asimov Agent Certification Program
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-testid="text-hero-subhead"
            >
              A voluntary certification verifying that AI agents correctly implement the cLaw
              Specification. Free for open source.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-overview">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p
              className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto"
              data-testid="text-overview"
            >
              The Asimov Agent Certification Program provides independent verification that AI
              agents correctly implement the cLaw Specification. Certification validates
              cryptographic enforcement of the Three Laws, proper agent identity, attestation
              protocols, and data protection compliance.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-levels">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-16"
              data-testid="text-levels-heading"
            >
              Certification Levels
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certificationLevels.map((level, index) => (
              <FadeIn key={level.name} delay={index * 0.15}>
                <Card
                  className={`${level.cardClass} rounded-md p-8 h-full flex flex-col`}
                  data-testid={`card-level-${level.name.toLowerCase()}`}
                >
                  <level.icon
                    className="w-10 h-10 text-primary mb-5"
                    data-testid={`icon-level-${level.name.toLowerCase()}`}
                  />
                  <h3
                    className="font-heading text-xl font-semibold text-foreground mb-3"
                    data-testid={`text-level-name-${level.name.toLowerCase()}`}
                  >
                    {level.name}
                  </h3>
                  <p
                    className="text-muted-foreground leading-relaxed mb-6 flex-1"
                    data-testid={`text-level-desc-${level.name.toLowerCase()}`}
                  >
                    {level.description}
                  </p>
                  <div className="space-y-1" data-testid={`text-level-price-${level.name.toLowerCase()}`}>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      {level.priceOpen}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4" />
                      {level.priceCommercial}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-process">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-16"
              data-testid="text-process-heading"
            >
              Certification Process
            </h2>
          </FadeIn>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" data-testid="timeline-line" />
            {processSteps.map((step, index) => (
              <FadeIn key={step.step} delay={index * 0.15}>
                <div
                  className="relative flex items-start gap-6 mb-12 last:mb-0"
                  data-testid={`timeline-step-${step.step}`}
                >
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="pt-2">
                    <h3
                      className="font-heading text-lg font-semibold text-foreground mb-1"
                      data-testid={`text-step-title-${step.step}`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-muted-foreground leading-relaxed"
                      data-testid={`text-step-desc-${step.step}`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-governance">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-8"
              data-testid="text-governance-heading"
            >
              Governance
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="text-muted-foreground text-lg leading-relaxed text-center max-w-3xl mx-auto"
              data-testid="text-governance"
            >
              The certification program is governed by the Asimov Framework Committee, ensuring
              that certification standards evolve with the specification while maintaining
              rigorous quality standards. All certification criteria are publicly documented and
              version-locked to specific cLaw Specification releases.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-faq">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-12"
              data-testid="text-faq-heading"
            >
              Frequently Asked Questions
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible data-testid="accordion-faq">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} data-testid={`faq-item-${index}`}>
                    <AccordionTrigger data-testid={`faq-trigger-${index}`}>
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent data-testid={`faq-content-${index}`}>
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-apply">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-4"
              data-testid="text-apply-heading"
            >
              Apply for Certification
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
              data-testid="text-apply-subhead"
            >
              Submit your application and we'll guide you through the certification process.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto space-y-5"
              data-testid="form-certification"
            >
              <div>
                <label
                  htmlFor="cert-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                  data-testid="label-name"
                >
                  Name *
                </label>
                <input
                  id="cert-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                  data-testid="input-name"
                />
              </div>
              <div>
                <label
                  htmlFor="cert-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                  data-testid="label-email"
                >
                  Email *
                </label>
                <input
                  id="cert-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@example.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label
                  htmlFor="cert-org"
                  className="block text-sm font-medium text-foreground mb-1.5"
                  data-testid="label-organization"
                >
                  Organization
                </label>
                <input
                  id="cert-org"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your organization (optional)"
                  data-testid="input-organization"
                />
              </div>
              <div>
                <label
                  htmlFor="cert-github"
                  className="block text-sm font-medium text-foreground mb-1.5"
                  data-testid="label-github"
                >
                  GitHub Repository *
                </label>
                <input
                  id="cert-github"
                  type="url"
                  required
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://github.com/your-org/your-agent"
                  data-testid="input-github"
                />
              </div>
              <div>
                <label
                  htmlFor="cert-level"
                  className="block text-sm font-medium text-foreground mb-1.5"
                  data-testid="label-level"
                >
                  Certification Level
                </label>
                <select
                  id="cert-level"
                  value={certLevel}
                  onChange={(e) => setCertLevel(e.target.value)}
                  className="w-full bg-card border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  data-testid="select-level"
                >
                  <option value="Core">Core</option>
                  <option value="Connected">Connected</option>
                  <option value="Sovereign">Sovereign</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="cert-details"
                  className="block text-sm font-medium text-foreground mb-1.5"
                  data-testid="label-details"
                >
                  Additional Details
                </label>
                <textarea
                  id="cert-details"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-card border border-border rounded-md px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Tell us about your agent (optional)"
                  data-testid="textarea-details"
                />
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
                data-testid="button-submit"
              >
                {mutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
