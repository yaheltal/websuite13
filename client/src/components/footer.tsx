import { WebSuiteLogo } from "./websuite-logo";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { IglooReveal } from "@/components/igloo-reveal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/40" data-testid="section-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <IglooReveal variant="fadeUp" amount={0.08} slow>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <WebSuiteLogo size={32} gradientId="ftr" />
              <span dir="ltr" className="text-lg font-extrabold tracking-tight" style={{
                background: "linear-gradient(135deg, hsl(220 80% 60%), hsl(260 70% 60%), hsl(170 80% 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                unicodeBidi: "bidi-override",
                direction: "ltr",
              }}>
                WebSuite
              </span>
            </div>
            <p className="text-sm text-charcoal-light leading-relaxed mb-4" data-testid="text-footer-desc">
              {t("footer.desc")}
            </p>
            <a href="mailto:websuite153@gmail.com" className="text-sm text-charcoal-light hover:text-charcoal transition-colors inline-block" dir="ltr">
              websuite153@gmail.com
            </a>
          </div>

          <div>
            <h4 className="font-bold text-charcoal mb-4 text-sm" data-testid="text-footer-services-title">
              {t("footer.services")}
            </h4>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => scrollTo("#services")}
                  className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block"
                  data-testid="link-footer-websites"
                >
                  {t("footer.services.websites")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#services")}
                  className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block"
                  data-testid="link-footer-landing"
                >
                  {t("footer.services.landing")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("#services")}
                  className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block"
                  data-testid="link-footer-card"
                >
                  {t("footer.services.card")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-charcoal mb-4 text-sm" data-testid="text-footer-contact-title">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => scrollTo("#contact")}
                  className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block"
                  data-testid="link-footer-quote"
                >
                  {t("footer.contact.quote")}
                </button>
              </li>
              <li>
                <a
                  href="mailto:websuite153@gmail.com"
                  className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block"
                  data-testid="link-footer-email"
                >
                  {t("footer.contact.email")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-charcoal mb-4 text-sm" data-testid="text-footer-legal-title">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-1">
              <li>
                <Link href="/legal/privacy" className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block" data-testid="link-footer-privacy">
                  {t("footer.legal.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block" data-testid="link-footer-terms">
                  {t("footer.legal.terms")}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-sm text-charcoal-light hover:text-charcoal transition-colors py-2 block" data-testid="link-footer-cookies">
                  {t("footer.legal.cookies")}
                </Link>
              </li>
            </ul>
          </div>
          </div>
        </IglooReveal>
      </div>

      <div className="border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-sm text-charcoal-light text-center" data-testid="text-copyright">
            © {currentYear} {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
