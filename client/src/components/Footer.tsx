import { Link } from "wouter";
import { Github, MessageCircle } from "lucide-react";
import { SiLinkedin, SiDiscord } from "react-icons/si";

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/framework" data-testid="link-footer-framework" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  The Asimov Framework
                </Link>
              </li>
              <li>
                <Link href="/framework/claw-spec" data-testid="link-footer-claw-spec" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  cLaw Specification
                </Link>
              </li>
              <li>
                <Link href="/framework/agent-friday" data-testid="link-footer-agent-friday" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Agent Friday
                </Link>
              </li>
              <li>
                <Link href="/framework/certification" data-testid="link-footer-certification" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Certification Program
                </Link>
              </li>
              <li>
                <Link href="/consulting" data-testid="link-footer-consulting" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/about" data-testid="link-footer-about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/FutureSpeakAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-footer-github"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/futurespeak"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-footer-discord"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiDiscord className="w-4 h-4" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/stephencwebster"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-footer-linkedin"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiLinkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@futurespeak.ai"
                  data-testid="link-footer-email"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  contact@futurespeak.ai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Code: MIT License
              </li>
              <li className="text-sm text-muted-foreground">
                Specifications: CC BY 4.0
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p data-testid="text-footer-credit" className="text-sm text-muted-foreground">
              Built by{" "}
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">
                Stephen C. Webster
              </Link>
              {" "}· Austin, TX
            </p>
            <p data-testid="text-footer-copyright" className="text-sm text-muted-foreground">
              © 2025–2026 FutureSpeak.AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
