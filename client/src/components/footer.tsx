import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-10 md:py-14 bg-background/60 glass-panel" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="WEB13">
              <rect x="2" y="2" width="44" height="44" rx="12" stroke="url(#ftr-lg)" strokeWidth="2.5"/>
              <path d="M14 18 L18 30 L22 22 L26 30 L30 18" stroke="url(#ftr-lg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="34" y="31" fontSize="14" fontWeight="800" fill="url(#ftr-lg)" textAnchor="middle" fontFamily="Assistant,sans-serif">13</text>
              <circle cx="38" cy="12" r="3" fill="hsl(170 80% 50%)"/>
              <defs><linearGradient id="ftr-lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="hsl(220 80% 65%)"/><stop offset=".5" stopColor="hsl(260 70% 65%)"/><stop offset="1" stopColor="hsl(170 80% 50%)"/></linearGradient></defs>
            </svg>
            <span className="text-lg font-extrabold tracking-tight" style={{ background: "linear-gradient(135deg, hsl(220 80% 60%), hsl(260 70% 60%), hsl(170 80% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              WEB13
            </span>
          </div>

          <p className="text-sm text-charcoal-light" data-testid="text-copyright">
            {currentYear} WEB13. כל הזכויות שמורות.
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
