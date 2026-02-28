import { lazy, Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { ScrollBackground } from "@/components/scroll-background";
import { useLenis } from "@/hooks/use-lenis";

const ServicesSection = lazy(() =>
  import("@/components/services-section").then((m) => ({ default: m.ServicesSection }))
);
const ScrollytellingSection = lazy(() =>
  import("@/components/scrollytelling-section").then((m) => ({ default: m.ScrollytellingSection }))
);
const FaqSection = lazy(() =>
  import("@/components/faq-section").then((m) => ({ default: m.FaqSection }))
);
const ContactSection = lazy(() =>
  import("@/components/contact-section").then((m) => ({ default: m.ContactSection }))
);
const Footer = lazy(() =>
  import("@/components/footer").then((m) => ({ default: m.Footer }))
);
const AiChatWidget = lazy(() =>
  import("@/components/ai-chat-widget").then((m) => ({ default: m.AiChatWidget }))
);

function BelowFoldFallback() {
  return <div className="min-h-[60vh]" aria-hidden="true" />;
}

export default function Home() {
  useLenis();

  return (
    <div className="min-h-screen overflow-x-hidden w-full" data-testid="page-home">
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <Suspense fallback={<BelowFoldFallback />}>
            <ScrollytellingSection />
            <ServicesSection />
            <FaqSection />
            <ContactSection />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
      <SiteHeader />
      <Suspense fallback={null}>
        <AiChatWidget />
      </Suspense>
    </div>
  );
}
