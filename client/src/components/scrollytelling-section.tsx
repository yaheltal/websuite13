import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Palette, Rocket, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/*
 * ============================================================
 *  IMAGE SEQUENCE CONFIGURATION
 * ============================================================
 *  Replace the placeholder URLs below with your own
 *  high-resolution image sequence (e.g. a 3D product spin,
 *  rendered frames from Blender/After Effects, etc.).
 *
 *  Requirements:
 *   - All frames should be the same resolution (e.g. 1024×1024)
 *   - PNG or WebP recommended for quality
 *   - 60 frames gives smooth playback; 30 is the minimum
 *   - Place files in  client/public/frames/  and reference as
 *     "/frames/frame_01.webp" etc.
 *
 *  Example with real assets:
 *    const FRAME_URLS = Array.from({ length: 60 }, (_, i) =>
 *      `/frames/frame_${String(i + 1).padStart(2, "0")}.webp`
 *    );
 * ============================================================
 */
const FRAME_COUNT = 60;
const FRAME_URLS = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `frame_${String(i + 1).padStart(2, "0")}.jpg`
);

const storyBlocks = [
  {
    icon: Sparkles,
    tagline: "01 — עיצוב",
    title: "עיצוב ללא פשרות",
    text: "כל פיקסל מתוכנן בקפידה. אנחנו לא משתמשים בתבניות מוכנות — כל אתר נבנה מאפס, בדיוק לפי החזון שלכם.",
  },
  {
    icon: Zap,
    tagline: "02 — ביצועים",
    title: "ביצועים בלי תירוצים",
    text: "מהירות טעינה מושלמת, ציון 100 ב-Google PageSpeed. הטכנולוגיות הכי מתקדמות — כדי שהלקוחות שלכם לא יחכו אפילו שנייה.",
  },
  {
    icon: Palette,
    tagline: "03 — המרה",
    title: "חוויית משתמש שמוכרת",
    text: "כל אלמנט מתוכנן להמרה. מהכפתור הראשון ועד לדף התשלום — מסלולים שהופכים מבקרים ללקוחות משלמים.",
  },
  {
    icon: Rocket,
    tagline: "04 — מהירות",
    title: "השקה מהירה ומדויקת",
    text: "תהליך עבודה שקוף ומהיר. מהבריף הראשוני ועד לעלייה לאוויר — תוך ימים בודדים, לא שבועות.",
  },
  {
    icon: Shield,
    tagline: "05 — ליווי",
    title: "ליווי מלא אחרי ההשקה",
    text: "לא נעלמים אחרי שהאתר עולה. תמיכה טכנית, עדכוני אבטחה, ואופטימיזציה שוטפת — תמיד ברמה הכי גבוהה.",
  },
];

interface ParallaxOrb {
  x: number;
  y: number;
  size: number;
  hue: number;
  alpha: number;
  speed: number;
}

function generateOrbs(count: number): ParallaxOrb[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 80 + Math.random() * 200,
    hue: 20 + Math.random() * 30,
    alpha: 0.03 + Math.random() * 0.04,
    speed: 0.2 + Math.random() * 0.3,
  }));
}

const PARALLAX_ORBS = generateOrbs(8);

function generatePlaceholderFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameIndex: number,
  totalFrames: number
) {
  const progress = frameIndex / (totalFrames - 1);
  const hue = 28 + progress * 12;
  const saturation = 55 + Math.sin(progress * Math.PI) * 15;
  const lightness = 42 + Math.sin(progress * Math.PI * 2) * 8;

  ctx.clearRect(0, 0, w, h);

  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
  bgGrad.addColorStop(0, `hsla(${hue}, 15%, 12%, 1)`);
  bgGrad.addColorStop(1, `hsla(${hue - 5}, 10%, 6%, 1)`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.38);
  gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.9)`);
  gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`);
  gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w * 0.38, 0, Math.PI * 2);
  ctx.fill();

  const angle = progress * Math.PI * 2;
  for (let r = 0; r < 5; r++) {
    const ringAngle = angle + (r * Math.PI * 2) / 5;
    const ringRadius = w * (0.18 + r * 0.045);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, ringRadius, ringAngle, ringAngle + Math.PI * 0.5);
    ctx.strokeStyle = `hsla(${hue}, 60%, ${75 + r * 3}%, ${0.25 - r * 0.04})`;
    ctx.lineWidth = 2 - r * 0.3;
    ctx.stroke();
  }

  for (let i = 0; i < 8; i++) {
    const orbAngle = angle + (i * Math.PI * 2) / 8;
    const orbDist = w * (0.2 + Math.sin(progress * Math.PI + i) * 0.08);
    const ox = w / 2 + Math.cos(orbAngle) * orbDist;
    const oy = h / 2 + Math.sin(orbAngle) * orbDist;
    const orbSize = 3 + Math.sin(progress * Math.PI * 2 + i * 1.5) * 2;
    const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbSize * 3);
    orbGrad.addColorStop(0, `hsla(${hue + i * 6}, 70%, 80%, 0.9)`);
    orbGrad.addColorStop(0.5, `hsla(${hue + i * 6}, 60%, 70%, 0.3)`);
    orbGrad.addColorStop(1, `hsla(${hue + i * 6}, 60%, 70%, 0)`);
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, orbSize * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const innerGlow = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.12);
  innerGlow.addColorStop(0, `hsla(${hue}, 80%, 90%, 0.5)`);
  innerGlow.addColorStop(1, `hsla(${hue}, 80%, 80%, 0)`);
  ctx.fillStyle = innerGlow;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.shadowColor = `hsla(${hue}, 60%, 70%, 0.5)`;
  ctx.shadowBlur = 20;
  ctx.fillStyle = `hsla(0, 0%, 100%, 0.95)`;
  ctx.font = `800 ${w * 0.13}px "Assistant", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("13", w / 2, h / 2 - w * 0.015);
  ctx.restore();

  ctx.fillStyle = `hsla(0, 0%, 100%, 0.45)`;
  ctx.font = `600 ${w * 0.035}px "Assistant", sans-serif`;
  ctx.letterSpacing = "4px";
  ctx.fillText("W E B 1 3", w / 2, h / 2 + w * 0.1);
}

function debounce(fn: () => void, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, ms);
  };
}

export function ScrollytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbsRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const canvasSizesRef = useRef<Map<HTMLCanvasElement, number>>(new Map());

  const setupCanvas = useCallback((canvas: HTMLCanvasElement, size: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    canvasSizesRef.current.set(canvas, size);
    return ctx;
  }, []);

  const renderFrame = useCallback((index: number, targetCanvas?: HTMLCanvasElement) => {
    const canvas = targetCanvas || canvasRef.current || mobileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));
    if (clampedIndex === currentFrameRef.current && !targetCanvas) return;
    currentFrameRef.current = clampedIndex;

    const size = canvasSizesRef.current.get(canvas) || 600;

    if (imagesLoaded && framesRef.current[clampedIndex]) {
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(framesRef.current[clampedIndex], 0, 0, size, size);
    } else {
      generatePlaceholderFrame(ctx, size, size, clampedIndex, FRAME_COUNT);
    }

    if (counterRef.current) {
      counterRef.current.textContent = String(clampedIndex + 1).padStart(2, "0");
    }
  }, [imagesLoaded]);

  useEffect(() => {
    const desktop = canvasRef.current;
    const mobile = mobileCanvasRef.current;

    const isMobile = window.innerWidth < 1024;
    const size = isMobile ? Math.min(window.innerWidth * 0.85, 500) : 600;

    if (desktop) setupCanvas(desktop, 600);
    if (mobile) setupCanvas(mobile, size);

    renderFrame(0, isMobile ? mobile || undefined : desktop || undefined);

    const handleResize = debounce(() => {
      const nowMobile = window.innerWidth < 1024;
      const newSize = nowMobile ? Math.min(window.innerWidth * 0.85, 500) : 600;
      if (desktop) setupCanvas(desktop, 600);
      if (mobile) setupCanvas(mobile, newSize);
      currentFrameRef.current = -1;
      renderFrame(0, nowMobile ? mobile || undefined : desktop || undefined);
    }, 200);

    window.addEventListener("resize", handleResize);

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    FRAME_URLS.forEach((url, i) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          framesRef.current = images;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => { loadedCount++; };
      img.src = url;
      images[i] = img;
    });

    return () => window.removeEventListener("resize", handleResize);
  }, [setupCanvas, renderFrame]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const progress = progressRef.current;
    const orbs = orbsRef.current;
    if (!section || !progress) return;

    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      if (pinned && !isMobile) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: pinned,
          pinSpacing: false,
        });
      }

      const activeCanvas = isMobile ? mobileCanvasRef.current : canvasRef.current;
      if (activeCanvas) {
        const frameObj = { frame: 0 };
        gsap.to(frameObj, {
          frame: FRAME_COUNT - 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: () => {
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              rafRef.current = requestAnimationFrame(() => {
                renderFrame(frameObj.frame, activeCanvas);
              });
            },
          },
        });
      }

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

      if (orbs) {
        gsap.to(orbs, {
          y: () => -window.innerHeight * 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const velocityTracker = { skew: 0 };
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const clampedSkew = gsap.utils.clamp(-4, 4, velocity / 400);
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
        titleWords.forEach((word, i) => {
          tl.fromTo(word, { opacity: 0, y: 50, rotateX: -15 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.35 }, 0.1 + i * 0.06);
        });
        if (body) {
          tl.fromTo(body, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.3);
        }
        if (divider) {
          tl.fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, 0.5);
        }
      });
    }, section);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [renderFrame]);

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
      className="relative"
      style={{ minHeight: "350vh" }}
      data-testid="section-scrollytelling"
    >
      <div
        ref={orbsRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {PARALLAX_ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              background: `radial-gradient(circle, hsla(${orb.hue}, 50%, 65%, ${orb.alpha}) 0%, transparent 70%)`,
              filter: `blur(${40 + orb.size * 0.15}px)`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      <div className="lg:hidden fixed inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ top: 0, height: "100dvh" }}
      >
        <canvas
          ref={mobileCanvasRef}
          className="rounded-2xl opacity-30"
          style={{
            maxWidth: "85vw",
            maxHeight: "85vw",
            filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.15))",
          }}
          data-testid="canvas-mobile-sequence"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
          <div className="space-y-[40vh] lg:space-y-[45vh] py-[25vh] lg:py-[40vh] order-2 lg:order-1">
            {storyBlocks.map((block, index) => (
              <div
                key={index}
                ref={(el) => { blockRefs.current[index] = el; }}
                className="max-w-lg relative"
                style={{ willChange: "transform" }}
                data-testid={`text-story-block-${index}`}
              >
                <div className="scrollytelling-glass-card lg:bg-transparent lg:backdrop-blur-none lg:border-0 lg:rounded-none lg:p-0 lg:shadow-none rounded-2xl p-6 border border-white/10 shadow-lg backdrop-blur-md">
                  <div data-anim="icon" className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-copper/20 to-copper/5 flex items-center justify-center border border-copper/10">
                      <block.icon className="w-6 h-6 text-copper" />
                    </div>
                  </div>

                  <p data-anim="tagline" className="text-xs font-bold tracking-[0.25em] uppercase text-copper mb-3" style={{ transformOrigin: "right center" }}>
                    {block.tagline}
                  </p>

                  <h3 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold leading-[1.1] mb-4 text-charcoal overflow-hidden">
                    {splitIntoWords(block.title)}
                  </h3>

                  <p data-anim="body" className="text-base md:text-lg text-charcoal-light/80 leading-relaxed max-w-sm">
                    {block.text}
                  </p>

                  {index < storyBlocks.length - 1 && (
                    <div data-anim="divider" className="mt-8 w-16 h-px bg-gradient-to-l from-copper/30 to-transparent origin-right" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            ref={pinnedRef}
            className="hidden lg:flex items-center justify-center order-1 lg:order-2"
            style={{ height: "100dvh" }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full pointer-events-none animate-pulse"
                style={{
                  width: "750px",
                  height: "750px",
                  background: "radial-gradient(circle, hsla(28, 60%, 48%, 0.08) 0%, hsla(28, 60%, 48%, 0.02) 40%, transparent 70%)",
                  filter: "blur(50px)",
                  animationDuration: "4s",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "500px",
                  height: "500px",
                  background: "radial-gradient(circle, hsla(140, 12%, 78%, 0.06) 0%, transparent 60%)",
                  filter: "blur(35px)",
                  transform: "translate(60px, -40px)",
                }}
              />

              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="rounded-3xl"
                  style={{
                    width: "600px",
                    height: "600px",
                    maxWidth: "min(600px, 35vw)",
                    maxHeight: "min(600px, 35vw)",
                    filter: "drop-shadow(0 30px 70px rgba(0,0,0,0.15))",
                  }}
                  data-testid="canvas-image-sequence"
                />

                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border/30 rounded-full px-5 py-2 shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
                  <span className="text-[11px] font-semibold text-charcoal-light tracking-wider">
                    FRAME <span ref={counterRef} className="text-copper font-bold tabular-nums">01</span> / {FRAME_COUNT}
                  </span>
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 h-[55%] w-[3px] rounded-full bg-sand-dark/15 overflow-hidden">
                <div
                  ref={progressRef}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-copper to-copper-dark rounded-full origin-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
