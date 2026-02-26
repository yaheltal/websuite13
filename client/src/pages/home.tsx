import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { ScrollBackground } from "@/components/scroll-background";
import { AiChatWidget } from "@/components/ai-chat-widget";

export default function Home() {
  return (
    <div className="min-h-screen" data-testid="page-home">
      <ScrollBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
      <AiChatWidget />
    </div>
  );
}
