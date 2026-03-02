import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import StarField from "@/components/StarField";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/hooks/use-toast";
import { Bot, ShieldCheck, Database, TrendingUp, Users, Building, ArrowRight, Send, Mail } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Agentic AI Workflow Design",
    description:
      "Multi-agent orchestration systems that automate complex enterprise processes. Custom autonomous workflows with built-in quality assurance and human-in-the-loop governance.",
  },
  {
    icon: ShieldCheck,
    title: "AI Compliance for Regulated Industries",
    description:
      "Enterprise AI architectures built for pharmaceutical, healthcare, and financial compliance. Proven deployment in Fortune 500 regulatory environments.",
  },
  {
    icon: Database,
    title: "RAG & Knowledge Architecture",
    description:
      "Retrieval-augmented generation systems anchored to proprietary enterprise data. Reduce hallucination, increase accuracy, and build trustworthy AI-powered knowledge bases.",
  },
];

const stats = [
  {
    value: "\u20AC120M",
    label: "in projected savings",
    description: "SAGE platform deployed for global pharmaceutical client",
  },
  {
    value: "5M+",
    label: "monthly readers",
    description: "Built and scaled digital media operations from 50K",
  },
  {
    value: "Fortune 500",
    label: "clients",
    description: "Sanofi, Merck, GM, Microsoft",
  },
];

export default function Consulting() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  usePageMeta({
    title: "Enterprise AI Consulting \u2014 FutureSpeak.AI",
    description:
      "Enterprise AI strategy from the team that trained Google Gemini. Agentic workflows, RAG architectures, and AI transformation strategies for Fortune 500 companies.",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const mailtoBody = `Name: ${name}\n\n${message}`;
    const mailto = `mailto:contact@futurespeak.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;
    window.open(mailto, "_blank");
    toast({ title: "Opening mail client", description: "Your message details have been pre-populated." });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

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
              Intelligence,{" "}
              <span className="text-gradient-amber">Architected.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
              data-testid="text-hero-subhead"
            >
              Enterprise AI strategy from the team that trained Google Gemini. We
              design agentic workflows, RAG architectures, and AI transformation
              strategies for Fortune 500 companies in regulated industries.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <a
              href="mailto:contact@futurespeak.ai"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md transition-colors"
              data-testid="link-schedule-session"
            >
              <Mail className="w-4 h-4" />
              Schedule a Strategy Session
            </a>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-16"
              data-testid="text-services-heading"
            >
              What We Do
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.15}>
                <div
                  className="bg-card border border-border rounded-xl p-8 h-full"
                  data-testid={`card-service-${index}`}
                >
                  <service.icon
                    className="w-10 h-10 text-primary mb-5"
                    data-testid={`icon-service-${index}`}
                  />
                  <h3
                    className="font-heading text-xl font-semibold text-foreground mb-3"
                    data-testid={`text-service-title-${index}`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-muted-foreground leading-relaxed"
                    data-testid={`text-service-desc-${index}`}
                  >
                    {service.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-results">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-16"
              data-testid="text-results-heading"
            >
              Results
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <FadeIn key={stat.value} delay={index * 0.15}>
                <div data-testid={`stat-block-${index}`}>
                  <p
                    className="text-5xl font-heading text-primary font-bold mb-2"
                    data-testid={`text-stat-value-${index}`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-lg font-medium text-foreground mb-1"
                    data-testid={`text-stat-label-${index}`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid={`text-stat-desc-${index}`}
                  >
                    {stat.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" data-testid="section-case-study">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-10"
              data-testid="text-case-study-heading"
            >
              Case Study &mdash; SAGE
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div
              className="glow-amber border border-primary/20 rounded-xl p-8 md:p-12 max-w-4xl mx-auto"
              data-testid="card-case-study"
            >
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                data-testid="text-case-study-prose"
              >
                SAGE (Strategic Adaptive Generative Engine) is a multi-agent AI
                platform developed for pharmaceutical clients. It automates
                complex compliance workflows, generates regulatory-ready
                content, and orchestrates multiple AI models in parallel &mdash;
                delivering &euro;120 million in projected savings for a single
                enterprise engagement.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20" data-testid="section-contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              className="font-heading text-3xl sm:text-4xl font-bold text-foreground text-center mb-4"
              data-testid="text-contact-heading"
            >
              Get in Touch
            </h2>
            <p
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
              data-testid="text-contact-subhead"
            >
              Tell us about your AI challenge and we'll schedule a strategy
              session.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto space-y-5"
              data-testid="form-contact"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                  data-testid="input-name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@company.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="How can we help?"
                  data-testid="input-subject"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Describe your AI challenge..."
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium px-6 py-3 rounded-md transition-colors w-full justify-center"
                data-testid="button-submit-contact"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </PageLayout>
  );
}
