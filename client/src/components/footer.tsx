import { SiGithub, SiLinkedin, SiInstagram } from "react-icons/si";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-10 md:py-14" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
              <span className="text-sm font-bold text-black">W</span>
            </div>
            <span className="text-lg font-bold">
              Web<span className="text-gradient">Craft</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            {currentYear} WebCraft Studio. כל הזכויות שמורות.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover-elevate"
              data-testid="link-github"
            >
              <SiGithub className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover-elevate"
              data-testid="link-linkedin"
            >
              <SiLinkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover-elevate"
              data-testid="link-instagram"
            >
              <SiInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
