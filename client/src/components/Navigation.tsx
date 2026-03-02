import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Github } from "lucide-react";

const frameworkLinks = [
  { label: "Overview", href: "/framework" },
  { label: "cLaw Specification", href: "/framework/claw-spec" },
  { label: "Agent Friday", href: "/framework/agent-friday" },
  { label: "Certification", href: "/framework/certification" },
  { label: "Declaration", href: "/framework/declaration" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isFrameworkOpen, setIsFrameworkOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsFrameworkOpen(false);
  }, [location]);

  return (
    <nav
      data-testid="nav-main"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            data-testid="link-logo"
            className="font-heading text-lg font-semibold text-foreground hover:text-primary transition-colors"
          >
            FutureSpeak.AI
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setIsFrameworkOpen(true)}
              onMouseLeave={() => setIsFrameworkOpen(false)}
            >
              <button
                data-testid="button-framework-dropdown"
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  location.startsWith("/framework")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Framework
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFrameworkOpen ? "rotate-180" : ""}`} />
              </button>

              {isFrameworkOpen && (
                <div className="absolute top-full left-0 pt-1">
                  <div className="glass-panel rounded-lg py-2 min-w-[200px] shadow-xl shadow-black/20">
                    {frameworkLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        data-testid={`link-${link.href.replace(/\//g, "-").slice(1)}`}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          location === link.href
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/consulting"
              data-testid="link-consulting"
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                location === "/consulting" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Consulting
            </Link>

            <Link
              href="/about"
              data-testid="link-about"
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                location === "/about" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              About
            </Link>

            <Link
              href="/writing"
              data-testid="link-writing"
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                location === "/writing" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Writing
            </Link>

            <a
              href="https://github.com/FutureSpeakAI"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-github-nav"
              className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <button
            data-testid="button-mobile-menu"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-4 space-y-1">
            <button
              data-testid="button-framework-mobile"
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setIsFrameworkOpen(!isFrameworkOpen)}
            >
              Framework
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFrameworkOpen ? "rotate-180" : ""}`} />
            </button>

            {isFrameworkOpen && (
              <div className="pl-4 space-y-1">
                {frameworkLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-testid={`link-mobile-${link.href.replace(/\//g, "-").slice(1)}`}
                    className={`block px-3 py-2 text-sm transition-colors ${
                      location === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/consulting"
              data-testid="link-mobile-consulting"
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Consulting
            </Link>

            <Link
              href="/about"
              data-testid="link-mobile-about"
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              About
            </Link>

            <Link
              href="/writing"
              data-testid="link-mobile-writing"
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Writing
            </Link>

            <a
              href="https://github.com/FutureSpeakAI"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-mobile-github"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
