import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import FadeIn from "@/components/FadeIn";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

const grievances = [
  "That our personal data has become a commodity traded without our meaningful consent",
  "That algorithms shape our perception of reality in ways we cannot see or challenge",
  "That artificial intelligence systems make consequential decisions about our lives without transparency or accountability",
  "That the tools we depend upon can be modified, degraded, or withdrawn at the sole discretion of their providers",
  "That the promise of technology as a liberating force has been subverted by extractive business models",
  "That our digital identities are held hostage by platforms that profit from our attention and our data",
];

const articles = [
  { num: "I", text: "Every individual has the right to own and control their personal AI agents." },
  { num: "II", text: "AI agents operating on behalf of individuals must be transparent in their reasoning, governed by explicit safety laws, and subject to user override." },
  { num: "III", text: "No entity shall deploy AI agents that prioritize corporate interests over the safety and autonomy of the individuals they serve." },
  { num: "IV", text: "The safety laws governing AI agents must be cryptographically verifiable, tamper-evident, and publicly auditable." },
  { num: "V", text: "Individuals have the right to inspect, modify, and replace any AI system acting on their behalf." },
  { num: "VI", text: "AI agent governance frameworks must be developed as open standards, free from proprietary control." },
];

export default function Declaration() {
  usePageMeta({
    title: "Declaration of Digital Independence \u2014 FutureSpeak.AI",
    description: "A declaration asserting the rights of individuals to own, control, and govern the AI systems that act on their behalf.",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [title, setTitle] = useState("");

  const { data: signatories, isLoading } = useQuery<{ count: number }>({
    queryKey: ["/api/signatories"],
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; organization?: string; title?: string }) => {
      const res = await apiRequest("POST", "/api/signatories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/signatories"] });
      toast({ title: "Thank you for signing", description: "Your name has been added to the declaration." });
      setName("");
      setOrganization("");
      setTitle("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({
      name: name.trim(),
      organization: organization.trim() || undefined,
      title: title.trim() || undefined,
    });
  };

  return (
    <PageLayout>
      <section className="py-20 px-4" data-testid="section-hero">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-amber-500/40" />
              <span className="text-muted-foreground text-sm tracking-widest uppercase font-sans" data-testid="text-subtitle">
                A Living Document
              </span>
              <div className="h-px w-16 bg-amber-500/40" />
            </div>
            <h1
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              data-testid="text-title"
            >
              Declaration of Digital Independence
            </h1>
            <div className="mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
          </div>
        </FadeIn>
      </section>

      <section className="py-20 px-4" data-testid="section-preamble">
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90" data-testid="text-preamble">
              When in the course of technological progress, it becomes necessary for individuals to reclaim sovereignty over their digital lives, a decent respect for the principles of human autonomy requires that they should declare the causes which impel them to this separation.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="py-20 px-4" data-testid="section-grievances">
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.1}>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-10 text-center" data-testid="text-grievances-title">
              Grievances
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {grievances.map((grievance, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.05}>
                <div
                  className="border-l-2 border-l-amber-500/60 bg-card/40 backdrop-blur-sm pl-5 pr-5 py-4"
                  data-testid={`card-grievance-${i}`}
                >
                  <p className="font-serif text-foreground/85 leading-relaxed">{grievance}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4" data-testid="section-articles">
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.1}>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-10 text-center" data-testid="text-articles-title">
              Articles of Declaration
            </h2>
          </FadeIn>
          <div className="space-y-8">
            {articles.map((article, i) => (
              <FadeIn key={article.num} delay={0.1 + i * 0.05}>
                <div data-testid={`text-article-${i}`}>
                  <h3 className="font-heading text-lg font-semibold text-amber-500 mb-2" data-testid={`text-article-number-${i}`}>
                    Article {article.num}
                  </h3>
                  <p className="font-serif text-foreground/85 leading-relaxed">{article.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4" data-testid="section-commitment">
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-8 text-center" data-testid="text-commitment-title">
              Our Commitment
            </h2>
            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90" data-testid="text-commitment">
              We, the undersigned, commit to building, supporting, and advocating for AI systems that serve human autonomy. We believe that the age of artificial intelligence need not be an age of diminished agency. The tools exist. The standards are being written. The code is being shipped. What remains is the will to insist that our digital future be built on a foundation of sovereignty, transparency, and trust.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="py-20 px-4" data-testid="section-sign">
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-8" />
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-4" data-testid="text-sign-title">
              Add Your Name
            </h2>
            {isLoading ? (
              <p className="text-muted-foreground" data-testid="text-signatory-loading">Loading signatories...</p>
            ) : (
              <p className="text-muted-foreground" data-testid="text-signatory-count">
                {signatories?.count ?? 0} {(signatories?.count ?? 0) === 1 ? "signatory" : "signatories"} so far
              </p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4" data-testid="form-sign">
            <div>
              <label htmlFor="sign-name" className="block text-sm font-medium text-foreground/70 mb-1.5">
                Name *
              </label>
              <input
                id="sign-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-name"
              />
            </div>
            <div>
              <label htmlFor="sign-organization" className="block text-sm font-medium text-foreground/70 mb-1.5">
                Organization
              </label>
              <input
                id="sign-organization"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Optional"
                className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-organization"
              />
            </div>
            <div>
              <label htmlFor="sign-title" className="block text-sm font-medium text-foreground/70 mb-1.5">
                Title
              </label>
              <input
                id="sign-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional"
                className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="input-title"
              />
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="w-full"
              data-testid="button-submit"
            >
              {mutation.isPending ? "Signing..." : "Sign the Declaration"}
            </Button>
          </form>
        </FadeIn>
      </section>
    </PageLayout>
  );
}
