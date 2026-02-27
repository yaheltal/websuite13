import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      gestureOrientation: 'vertical',
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.normalizeScroll(true);

    ScrollTrigger.refresh();

    const onLoad = () => { ScrollTrigger.refresh(); };
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = "";
      ScrollTrigger.refresh();
    };
  }, []);

  return lenisRef;
}
