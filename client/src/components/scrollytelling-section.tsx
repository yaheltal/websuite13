import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Palette, Rocket, Shield } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ScrollReveal } from "@/components/scroll-reveal";

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
      src: `https://images.unsplash.com/${UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]}?w=400&h=270&fit=crop&q=60&auto=format`,
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

const ALL_MOCKUPS = generateMockups(14);
const MOBILE_MOCKUP_COUNT = 3;


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
      const lastProgByMockup: number[] = new Array(MOCKUPS.length).fill(-1);

      mockupRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = MOCKUPS[i];
        const innerCard = el.querySelector("[data-card-inner]") as HTMLElement;
        if (!innerCard) return;

        el.style.willChange = 'transform';
        innerCard.style.willChange = 'transform, filter';

        if (!isMobile) {
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
        }

        const direction = i % 2 === 0 ? -1 : 1;
        const yTravel = window.innerHeight * (0.5 + m.speed * 0.9) * direction;
        const mobileFactor = isMobile ? 0.5 : 1;
        const zDrift = (m.z * 0.3) * (i % 2 === 0 ? 1 : -1);

        const scrollTween = gsap.fromTo(
          el,
          {
            y: -yTravel * 0.4 * mobileFactor,
            z: m.z - 100,
            rotateX: m.rotateX * 0.6,
            rotateY: m.rotateY * 0.6,
            rotateZ: m.rotateZ * 0.4,
            scale: 0.85,
          },
          {
            y: yTravel * mobileFactor,
            z: m.z + zDrift + 50,
            rotateX: m.rotateX * 2.5,
            rotateY: m.rotateY * 2.5,
            rotateZ: m.rotateZ * 2,
            scale: 1.1,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              onUpdate: (self) => {
                const prog = self.progress;
                if (Math.abs(prog - lastProgByMockup[i]) < 0.008) return;
                lastProgByMockup[i] = prog;
                const focusFactor = 1 - Math.abs(prog - 0.5) * 2;
                const blur = m.blurBase * (1 - focusFactor * 0.95);
                const brightness = 0.7 + focusFactor * 0.3;
                if (innerCard) {
                  innerCard.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;
                }
                if (!isMobile) {
                  const glare = glareRefs.current[i];
                  if (glare) {
                    const angle = 100 + prog * 160;
                    const intensity = 0.08 + focusFactor * 0.12;
                    glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${intensity.toFixed(2)}) 0%, transparent 50%, rgba(255,255,255,${(intensity * 0.3).toFixed(2)}) 100%)`;
                  }
                }
              },
            },
          }
        );
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

      if (!isMobile) {
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
      }

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
          tl.fromTo(icon, { opacity: 0, scale: 0, rotateZ: -45, y: 30 }, { opacity: 1, scale: 1, rotateZ: 0, y: 0, duration: 0.25, ease: "back.out(2)" }, 0);
        }
        if (tagline) {
          tl.fromTo(tagline, { opacity: 0, y: 20, clipPath: "inset(0 100% 0 0)", filter: "blur(8px)" }, { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", filter: "blur(0px)", duration: 0.3 }, 0.05);
        }
        titleWords.forEach((word, wi) => {
          tl.fromTo(word,
            { opacity: 0, y: 60, rotateX: -25, filter: "blur(12px)", scale: 0.8 },
            { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1, duration: 0.4 },
            0.08 + wi * 0.07
          );
        });
        if (body) {
          tl.fromTo(body, { opacity: 0, y: 40, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 }, 0.35);
        }
        if (divider) {
          tl.fromTo(divider, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.3 }, 0.55);
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
          const sensitivity = (m.zIndex / 3) * 0.8;
          const shiftX = -mx * 22 * sensitivity;
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
      style={{ minHeight: isMobileInit ? "200vh" : "350vh" }}
      data-testid="section-scrollytelling"
    >

      <div
        ref={galleryRef}
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}
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
                    0 4px 12px rgba(0,0,0,0.06),
                    0 10px 30px rgba(0,0,0,0.08),
                    0 0 24px rgba(200,210,230,0.25)
                  `,
                }}
              >
                <div className="h-5 sm:h-6 bg-gradient-to-b from-white/90 to-gray-100/90 flex items-center px-2 gap-1 sm:gap-1.5 border-b border-gray-200/50">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/60" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400/60" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/60" />
                  <div className="flex-1 mx-1 sm:mx-2">
                    <div className="h-2.5 sm:h-3 bg-gray-300/30 rounded-full max-w-[60%] mx-auto" />
                  </div>
                </div>
                <img
                  src={isMobileInit ? m.src.replace("w=400&h=270", "w=250&h=170").replace("q=60", "q=50") : m.src}
                  alt=""
                  width={isMobileInit ? 300 : 500}
                  height={isMobileInit ? 200 : 340}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[3/2] object-cover transition-transform duration-700"
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
        <div className="pt-[20vh] pb-[8vh] sm:py-[25vh] lg:py-[35vh] space-y-[30vh] sm:space-y-[40vh] lg:space-y-[50vh]">
          {storyBlocks.map((block, index) => (
            <div
              key={index}
              ref={(el) => { blockRefs.current[index] = el; }}
              className="relative max-w-xl mx-auto lg:mx-0"
              style={{ willChange: "transform" }}
              data-testid={`text-story-block-${index}`}
            >
              <ScrollReveal staggerDelay={index * 0.1}>
                <div className="scrollytelling-glass-card rounded-2xl p-4 sm:p-7 md:p-8 border border-gray-200/60 backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]">
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(245,247,252,0.2) 50%, transparent 70%)",
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

                <h3 className="text-2xl sm:text-3xl md:text-[2.75rem] font-extrabold leading-[1.1] mb-4 text-charcoal overflow-hidden relative">
                  {splitIntoWords(block.title)}
                </h3>

                <p data-anim="body" className="text-base md:text-lg text-charcoal-light leading-relaxed relative">
                  {block.text}
                </p>

                {index < storyBlocks.length - 1 && (
                  <div data-anim="divider" className="mt-8 w-16 h-px bg-gradient-to-l from-copper/40 to-transparent origin-right relative" />
                )}
                </div>
              </ScrollReveal>

              {index < storyBlocks.length - 1 && (
                <div className="flex justify-center items-center py-8 sm:py-10 pointer-events-none select-none" aria-hidden="true">
                  <svg
                    viewBox="0 0 80 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-36 sm:w-20 sm:h-40 md:w-20 md:h-44"
                  >
                    <defs>
                      <linearGradient id={`arrowGrad${index}`} x1="40" y1="0" x2="40" y2="180" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="hsl(220, 75%, 70%)" stopOpacity="0.4" />
                        <stop offset="40%" stopColor="hsl(260, 55%, 65%)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="hsl(25, 60%, 58%)" stopOpacity="0.45" />
                      </linearGradient>
                      <filter id={`glow${index}`}>
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path
                      d="M40 8 C14 30, 66 50, 40 75 C14 100, 66 120, 40 145"
                      stroke={`url(#arrowGrad${index})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      filter={`url(#glow${index})`}
                    />
                    <path
                      d="M30 136 L40 158 L50 136"
                      stroke={`url(#arrowGrad${index})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      filter={`url(#glow${index})`}
                    />
                    <circle cx="40" cy="8" r="3" fill="hsl(220, 75%, 70%)" opacity="0.3" />
                    <circle cx="40" cy="158" r="2" fill="hsl(25, 60%, 58%)" opacity="0.25" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none">
        <div className="h-32 w-[3px] rounded-full bg-gray-300/50 overflow-hidden scrollytelling-progress-track">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-copper to-copper-dark rounded-full origin-top"
          />
        </div>
      </div>
    </section>
  );
}
