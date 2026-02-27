import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";
import { WebSuiteLogo } from "./websuite-logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-10 md:py-14 bg-background/60 glass-panel" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <WebSuiteLogo size={32} gradientId="ftr" />
            <span className="text-lg font-extrabold tracking-tight" style={{ background: "linear-gradient(135deg, hsl(220 80% 60%), hsl(260 70% 60%), hsl(170 80% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              WebSuite
            </span>
          </div>

          <p className="text-sm text-charcoal-light" data-testid="text-copyright">
            {currentYear} WebSuite. כל הזכויות שמורות.
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: SiGithub, testId: "link-github" },
              { icon: SiLinkedin, testId: "link-linkedin" },
              { icon: SiInstagram, testId: "link-instagram" },
            ].map(({ icon: Icon, testId }) => (
              <a
                key={testId}
                href="#"
                className="w-9 h-9 rounded-lg bg-sand-dark/20 flex items-center justify-center text-charcoal-light transition-colors hover:text-charcoal hover:bg-sand-dark/40 hover-elevate"
                data-testid={testId}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
