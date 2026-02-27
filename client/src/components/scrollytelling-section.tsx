import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Palette, Rocket, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger);

const storyIcons = [Sparkles, Zap, Palette, Rocket, Shield];
const storyKeys = ["01", "02", "03", "04", "05"];

interface FloatingMockup {
  id: number;
  src: string;
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  speed: number;
  width: number;
  blurBase: number;
  hoverDx: number;
  hoverDy: number;
  hoverDur: number;
  hoverRotZ: number;
}

const UNSPLASH_IMAGES = [
  "photo-1460925895917-afdab827c52f",
  "photo-1547658719-da2b51169166",
  "photo-1551288049-bebda4e38f71",
  "photo-1555421689-d68471e189f2",
  "photo-1559028012-481c04fa702d",
  "photo-1517292987719-0369a794ec0f",
  "photo-1498050108023-c5249f4df085",
  "photo-1531403009284-440f080d1e12",
  "photo-1522542550221-31fd19575a2d",
  "photo-1504868584819-f8e8b4b6d7e3",
  "photo-1488590528505-98d2b5aba04b",
  "photo-1461749280684-dccba630e2f6",
  "photo-1555066931-4365d14bab8c",
  "photo-1581291518857-4e27b48ff24e",
  "photo-1519389950473-47ba0277781c",
  "photo-1563013544-824ae1b704d3",
  "photo-1542744173-8e7e53415bb0",
  "photo-1573164713988-8665fc963095",
  "photo-1550745165-9bc0b252726f",
  "photo-1553877522-43269d4ea984",
  "photo-1454165804606-c3d57bc86b40",
  "photo-1516321318423-f06f85e504b3",
  "photo-1551434678-e076c223a692",
  "photo-1486312338219-ce68d2c6f44d",
  "photo-1581092795360-fd1ca04f0952",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function generateMockups(count: number): FloatingMockup[] {
  return Array.from({ length: count }, (_, i) => {
    const s1 = seededRandom(i * 3 + 1);
    const s2 = seededRandom(i * 3 + 2);
    const s3 = seededRandom(i * 3 + 3);
    const s4 = seededRandom(i * 7 + 5);
    const s5 = seededRandom(i * 11 + 7);
    const s6 = seededRandom(i * 13 + 11);

    const depthLayer = i % 3;
    const baseOpacity = depthLayer === 0 ? 0.25 : depthLayer === 1 ? 0.4 : 0.6;
    const baseScale = depthLayer === 0 ? 0.5 : depthLayer === 1 ? 0.7 : 0.9;
    const baseWidth = depthLayer === 0 ? 180 : depthLayer === 1 ? 260 : 340;
    const baseZ = depthLayer === 0 ? -500 : depthLayer === 1 ? -200 : 0;
    const blurBase = depthLayer === 0 ? 10 : depthLayer === 1 ? 4 : 0;

    return {
      id: i,
      src: `https://images.unsplash.com/${UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]}?w=500&h=340&fit=crop&q=75`,
      x: -15 + s1 * 115,
      y: s2 * 95,
      z: baseZ + (s5 - 0.5) * 250,
      scale: baseScale + s3 * 0.25,
      opacity: baseOpacity + s4 * 0.15,
      zIndex: depthLayer + 1,
      rotateX: -8 + s1 * 16,
      rotateY: -10 + s2 * 20,
      rotateZ: -3 + s3 * 6,
      speed: 0.15 + s5 * 0.55,
      width: baseWidth + Math.floor(s4 * 60),
      blurBase,
      hoverDx: 8 + s6 * 20,
      hoverDy: 6 + s3 * 18,
      hoverDur: 3 + s4 * 5,
      hoverRotZ: 1 + s6 * 3,
    };
  });
}

const ALL_MOCKUPS = generateMockups(25);
const MOBILE_MOCKUP_COUNT = 10;

const BG_COLORS = [
  { r: 15, g: 10, b: 40 },
  { r: 25, g: 8, b: 55 },
  { r: 10, g: 18, b: 50 },
  { r: 30, g: 5, b: 45 },
  { r: 12, g: 15, b: 48 },
];

export function ScrollytellingSection() {
  const { t } = useI18n();

  const storyBlocks = storyKeys.map((key, i) => ({
    icon: storyIcons[i],
    tagline: t(`story.${key}.tagline`),
    title: t(`story.${key}.title`),
    text: t(`story.${key}.text`),
  }));

  const isMobileInit = typeof window !== "undefined" && window.innerWidth < 768;
  const MOCKUPS = isMobileInit ? ALL_MOCKUPS.slice(0, MOBILE_MOCKUP_COUNT) : ALL_MOCKUPS;

  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mockupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX / window.innerWidth;
    mouseRef.current.y = e.clientY / window.innerHeight;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const progress = progressRef.current;
    if (!section || !gallery || !progress) return;

    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const ctx = gsap.context(() => {
      mockupRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = MOCKUPS[i];
        const innerCard = el.querySelector("[data-card-inner]") as HTMLElement;
        if (!innerCard) return;

        el.style.willChange = 'transform';
        innerCard.style.willChange = 'transform, filter';

        gsap.to(innerCard, {
          x: `+=${m.hoverDx * (i % 2 === 0 ? 1 : -1)}`,
          y: `+=${m.hoverDy * (i % 2 === 0 ? -1 : 1)}`,
          rotateZ: `+=${m.hoverRotZ * (i % 2 === 0 ? 1 : -1)}`,
          duration: m.hoverDur,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          force3D: true,
        });

        const direction = i % 2 === 0 ? -1 : 1;
        const yTravel = window.innerHeight * (0.5 + m.speed * 0.9) * direction;
        const mobileFactor = isMobile ? 0.5 : 1;
        const zDrift = (m.z * 0.3) * (i % 2 === 0 ? 1 : -1);

        const scrollTween = gsap.fromTo(
          el,
          {
            y: -yTravel * 0.3 * mobileFactor,
            z: m.z,
            rotateX: m.rotateX * 0.4,
            rotateY: m.rotateY * 0.4,
            rotateZ: m.rotateZ * 0.3,
          },
          {
            y: yTravel * mobileFactor,
            z: m.z + zDrift,
            rotateX: m.rotateX * 2,
            rotateY: m.rotateY * 2,
            rotateZ: m.rotateZ * 1.5,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              onUpdate: (self) => {
                const prog = self.progress;
                const focusFactor = 1 - Math.abs(prog - 0.5) * 2;
                const blur = m.blurBase * (1 - focusFactor * 0.9);
                if (innerCard) {
                  innerCard.style.filter = `blur(${blur}px)`;
                }
                const glare = glareRefs.current[i];
                if (glare) {
                  const angle = 120 + prog * 120;
                  glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)`;
                }
              },
            },
          }
        );
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          orbRefs.current.forEach((orb, i) => {
            if (!orb) return;
            const shift = Math.sin(p * Math.PI * 2 + i * 1.2) * 15;
            const vShift = Math.cos(p * Math.PI * 1.5 + i * 0.8) * 10;
            orb.style.transform = `translate(${shift}%, ${vShift}%)`;
          });

          const ci = Math.floor(p * (BG_COLORS.length - 1));
          const ni = Math.min(ci + 1, BG_COLORS.length - 1);
          const t = (p * (BG_COLORS.length - 1)) - ci;
          const c = BG_COLORS[ci];
          const n = BG_COLORS[ni];
          const r = Math.round(c.r + (n.r - c.r) * t);
          const g = Math.round(c.g + (n.g - c.g) * t);
          const b = Math.round(c.b + (n.b - c.b) * t);
          if (bgRef.current) {
            bgRef.current.style.backgroundColor = `rgb(${r},${g},${b})`;
          }
        },
      });

      gsap.fromTo(
        progress,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      const velocityTracker = { skew: 0 };
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const clampedSkew = gsap.utils.clamp(-3, 3, velocity / 500);
          gsap.to(velocityTracker, {
            skew: clampedSkew,
            duration: 0.3,
            overwrite: true,
            onUpdate: () => {
              blockRefs.current.forEach((block) => {
                if (block) {
                  block.style.transform = `skewY(${velocityTracker.skew}deg)`;
                }
              });
            },
          });
        },
      });

      blockRefs.current.forEach((block) => {
        if (!block) return;

        const icon = block.querySelector("[data-anim='icon']");
        const tagline = block.querySelector("[data-anim='tagline']");
        const titleWords = block.querySelectorAll("[data-anim='word']");
        const body = block.querySelector("[data-anim='body']");
        const divider = block.querySelector("[data-anim='divider']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 82%",
            end: "top 30%",
            scrub: 1,
          },
        });

        if (icon) {
          tl.fromTo(icon, { opacity: 0, scale: 0.5, y: 25 }, { opacity: 1, scale: 1, y: 0, duration: 0.2 }, 0);
        }
        if (tagline) {
          tl.fromTo(tagline, { opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.3 }, 0.05);
        }
        titleWords.forEach((word, wi) => {
          tl.fromTo(word, { opacity: 0, y: 50, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.35 }, 0.1 + wi * 0.06);
        });
        if (body) {
          tl.fromTo(body, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.3);
        }
        if (divider) {
          tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, 0.5);
        }
      });
    }, section);

    const quickXSetters: ReturnType<typeof gsap.quickTo>[] = [];
    if (!isMobile) {
      mockupRefs.current.forEach((el, i) => {
        if (!el) return;
        quickXSetters[i] = gsap.quickTo(el, "x", { duration: 1.2, ease: "power2.out" });
      });

      const tickerFn = () => {
        const mx = mouseRef.current.x - 0.5;
        const my = mouseRef.current.y - 0.5;
        mockupRefs.current.forEach((el, i) => {
          if (!el || !quickXSetters[i]) return;
          const m = MOCKUPS[i];
          const sensitivity = (m.zIndex / 3) * 0.6;
          const shiftX = -mx * 15 * sensitivity;
          quickXSetters[i](shiftX);
        });
      };
      gsap.ticker.add(tickerFn);

      return () => {
        ctx.revert();
        gsap.ticker.remove(tickerFn);
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }

    return () => {
      ctx.revert();
    };
  }, [handleMouseMove]);

  function splitIntoWords(text: string) {
    return text.split(" ").map((word, i) => (
      <span
        key={i}
        data-anim="word"
        className="inline-block"
        style={{ perspective: "600px" }}
      >
        {word}&nbsp;
      </span>
    ));
  }

  return (
    <section
      ref={sectionRef}
      id="scrollytelling"
      className="relative overflow-hidden"
      style={{ minHeight: "350vh" }}
      data-testid="section-scrollytelling"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: "rgb(15, 10, 40)" }}
      >
        {[
          { w: "60vw", h: "60vw", top: "5%", left: "10%", bg: "radial-gradient(circle, hsla(270,80%,40%,0.35) 0%, transparent 70%)" },
          { w: "50vw", h: "50vw", top: "35%", right: "5%", bg: "radial-gradient(circle, hsla(220,80%,40%,0.3) 0%, transparent 70%)" },
          { w: "45vw", h: "45vw", bottom: "10%", left: "20%", bg: "radial-gradient(circle, hsla(320,70%,35%,0.25) 0%, transparent 70%)" },
          { w: "55vw", h: "55vw", top: "55%", left: "50%", bg: "radial-gradient(circle, hsla(260,60%,45%,0.2) 0%, transparent 70%)" },
        ].map((orb, i) => (
          <div
            key={i}
            ref={(el) => { orbRefs.current[i] = el; }}
            className="absolute pointer-events-none"
            style={{
              width: orb.w,
              height: orb.h,
              top: orb.top,
              bottom: (orb as any).bottom,
              left: orb.left,
              right: (orb as any).right,
              background: orb.bg,
              filter: "blur(80px)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      <div
        ref={galleryRef}
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
        aria-hidden="true"
        data-testid="floating-gallery"
      >
        {MOCKUPS.map((m, i) => {
          const mobileScale = isMobileInit ? 0.55 : 1;
          return (
            <div
              key={m.id}
              ref={(el) => { mockupRefs.current[i] = el; }}
              className="absolute"
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: `${m.width * mobileScale}px`,
                zIndex: m.zIndex,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              data-testid={`mockup-card-${m.id}`}
            >
              <div
                data-card-inner
                className="relative rounded-xl overflow-hidden"
                style={{
                  transform: `scale(${m.scale})`,
                  opacity: m.opacity,
                  filter: `blur(${m.blurBase}px)`,
                  willChange: "transform, filter",
                  boxShadow: `
                    0 4px 6px rgba(0,0,0,0.15),
                    0 10px 25px rgba(0,0,0,0.2),
                    0 25px 60px rgba(0,0,0,0.25),
                    0 0 0 1px rgba(255,255,255,0.06)
                  `,
                }}
              >
                <div className="h-5 sm:h-6 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center px-2 gap-1 sm:gap-1.5 border-b border-white/5">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500/80" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/80" />
                  <div className="flex-1 mx-1 sm:mx-2">
                    <div className="h-2.5 sm:h-3 bg-white/10 rounded-full max-w-[60%] mx-auto" />
                  </div>
                </div>
                <img
                  src={isMobileInit ? m.src.replace("w=500&h=340", "w=300&h=200") : m.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/2] object-cover"
                  style={{ display: "block" }}
                />
                {!isMobileInit && (
                  <div
                    ref={(el) => { glareRefs.current[i] = el; }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(120deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)",
                      mixBlendMode: "overlay",
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-[25vh] lg:py-[35vh] space-y-[40vh] lg:space-y-[50vh]">
          {storyBlocks.map((block, index) => (
            <div
              key={index}
              ref={(el) => { blockRefs.current[index] = el; }}
              className="relative max-w-xl mx-auto lg:mx-0"
              style={{ willChange: "transform" }}
              data-testid={`text-story-block-${index}`}
            >
              <div className="scrollytelling-glass-card rounded-2xl p-7 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, hsla(270, 50%, 60%, 0.06) 0%, transparent 50%)",
                  }}
                />

                <div data-anim="icon" className="flex items-center gap-3 mb-5 relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-copper/25 to-copper/10 flex items-center justify-center border border-copper/20 shadow-sm">
                    <block.icon className="w-6 h-6 text-copper" />
                  </div>
                </div>

                <p
                  data-anim="tagline"
                  className="text-xs font-bold tracking-[0.25em] uppercase text-copper mb-3 relative"
                  style={{ transformOrigin: "right center" }}
                >
                  {block.tagline}
                </p>

                <h3 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold leading-[1.1] mb-4 text-white overflow-hidden relative">
                  {splitIntoWords(block.title)}
                </h3>

                <p data-anim="body" className="text-base md:text-lg text-white/70 leading-relaxed relative">
                  {block.text}
                </p>

                {index < storyBlocks.length - 1 && (
                  <div data-anim="divider" className="mt-8 w-16 h-px bg-gradient-to-l from-copper/40 to-transparent origin-right relative" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none">
        <div className="h-32 w-[3px] rounded-full bg-white/10 overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-copper to-copper-dark rounded-full origin-top"
          />
        </div>
      </div>
    </section>
  );
}
