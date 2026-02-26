import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { ScrollytellingSection } from "@/components/scrollytelling-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { ScrollBackground } from "@/components/scroll-background";
import { AiChatWidget } from "@/components/ai-chat-widget";
import { useLenis } from "@/hooks/use-lenis";

export default function Home() {
  useLenis();

  return (
    <div className="min-h-screen" data-testid="page-home">
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <ScrollytellingSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      <AiChatWidget />
    </div>
  );
}
