import { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { LiquidCursorProvider } from "@/components/liquid-cursor";

const Home = lazy(() => import("@/pages/home"));
const Onboarding = lazy(() => import("@/pages/onboarding"));
const LegalPage = lazy(() => import("@/pages/legal"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" aria-hidden>
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string)?.trim();

function useGoogleAnalytics() {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const load = () => {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);
      (window as any).dataLayer = (window as any).dataLayer || [];
      const gtag = (...a: unknown[]) => ((window as any).dataLayer as unknown[]).push(a);
      (window as any).gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID);
    };
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(load, { timeout: 3000 });
    } else {
      setTimeout(load, 2000);
    }
  }, []);
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/legal/:type" component={LegalPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useGoogleAnalytics();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          <LiquidCursorProvider>
            <Toaster />
            <Router />
          </LiquidCursorProvider>
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
