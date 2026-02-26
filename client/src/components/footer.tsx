import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-10 md:py-14 bg-sand-light/30" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center">
              <span className="text-sm font-extrabold text-white">W</span>
            </div>
            <span className="text-lg font-extrabold text-charcoal">
              Web<span className="text-copper">Craft</span>
            </span>
          </div>

          <p className="text-sm text-charcoal-light" data-testid="text-copyright">
            {currentYear} WebCraft Studio. כל הזכויות שמורות.
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
