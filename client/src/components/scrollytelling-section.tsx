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
    title: "עיצוב ללא\nפשרות",
    text: "כל פיקסל מתוכנן בקפידה. אנחנו לא משתמשים בתבניות מוכנות — כל אתר נבנה מאפס, בדיוק לפי החזון שלכם.",
  },
  {
    icon: Zap,
    tagline: "02 — ביצועים",
    title: "ביצועים בלי\nתירוצים",
    text: "מהירות טעינה מושלמת, ציון 100 ב-Google PageSpeed. הטכנולוגיות הכי מתקדמות — כדי שהלקוחות שלכם לא יחכו אפילו שנייה.",
  },
  {
    icon: Palette,
    tagline: "03 — המרה",
    title: "חוויית משתמש\nשמוכרת",
    text: "כל אלמנט מתוכנן להמרה. מהכפתור הראשון ועד לדף התשלום — מסלולים שהופכים מבקרים ללקוחות משלמים.",
  },
  {
    icon: Rocket,
    tagline: "04 — מהירות",
    title: "השקה מהירה\nומדויקת",
    text: "תהליך עבודה שקוף ומהיר. מהבריף הראשוני ועד לעלייה לאוויר — תוך ימים בודדים, לא שבועות.",
  },
  {
    icon: Shield,
    tagline: "05 — ליווי",
    title: "ליווי מלא\nאחרי ההשקה",
    text: "לא נעלמים אחרי שהאתר עולה. תמיכה טכנית, עדכוני אבטחה, ואופטימיזציה שוטפת — תמיד ברמה הכי גבוהה.",
  },
];

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

  const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.45);
  gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness + 15}%)`);
  gradient.addColorStop(0.5, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
  gradient.addColorStop(1, `hsl(${hue - 5}, ${saturation - 10}%, ${lightness - 12}%)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w * 0.38, 0, Math.PI * 2);
  ctx.fill();

  const angle = progress * Math.PI * 2;
  const ringCount = 4;
  for (let r = 0; r < ringCount; r++) {
    const ringAngle = angle + (r * Math.PI * 2) / ringCount;
    const ringRadius = w * (0.25 + r * 0.04);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, ringRadius, ringAngle, ringAngle + Math.PI * 0.6);
    ctx.strokeStyle = `hsla(${hue}, 60%, ${70 + r * 5}%, ${0.3 - r * 0.05})`;
    ctx.lineWidth = 2.5 - r * 0.4;
    ctx.stroke();
  }

  const orbCount = 6;
  for (let i = 0; i < orbCount; i++) {
    const orbAngle = angle + (i * Math.PI * 2) / orbCount;
    const orbDist = w * (0.22 + Math.sin(progress * Math.PI + i) * 0.06);
    const ox = w / 2 + Math.cos(orbAngle) * orbDist;
    const oy = h / 2 + Math.sin(orbAngle) * orbDist;
    const orbSize = 4 + Math.sin(progress * Math.PI * 2 + i * 1.5) * 2.5;
    const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbSize * 2);
    orbGrad.addColorStop(0, `hsla(${hue + i * 8}, 70%, 75%, 0.8)`);
    orbGrad.addColorStop(1, `hsla(${hue + i * 8}, 70%, 75%, 0)`);
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, orbSize * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const innerGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.15);
  innerGrad.addColorStop(0, `hsla(${hue}, 60%, 85%, 0.35)`);
  innerGrad.addColorStop(1, `hsla(${hue}, 60%, 60%, 0)`);
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `hsla(0, 0%, 100%, 0.95)`;
  ctx.font = `800 ${w * 0.12}px "Assistant", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("13", w / 2, h / 2 - w * 0.02);

  ctx.fillStyle = `hsla(0, 0%, 100%, 0.55)`;
  ctx.font = `600 ${w * 0.04}px "Assistant", sans-serif`;
  ctx.fillText("WEB13", w / 2, h / 2 + w * 0.1);
}

export function ScrollytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)));
    if (clampedIndex === currentFrameRef.current && imagesLoaded) return;
    currentFrameRef.current = clampedIndex;

    if (imagesLoaded && framesRef.current[clampedIndex]) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(framesRef.current[clampedIndex], 0, 0, canvas.width, canvas.height);
    } else {
      generatePlaceholderFrame(ctx, canvas.width, canvas.height, clampedIndex, FRAME_COUNT);
    }

    if (counterRef.current) {
      counterRef.current.textContent = String(clampedIndex + 1).padStart(2, "0");
    }
  }, [imagesLoaded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 600;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    renderFrame(0);

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
      img.onerror = () => {
        loadedCount++;
      };
      img.src = url;
      images[i] = img;
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const progress = progressRef.current;
    if (!section || !pinned || !progress) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: pinned,
        pinSpacing: false,
      });

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
              renderFrame(frameObj.frame);
            });
          },
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

      blockRefs.current.forEach((block) => {
        if (!block) return;

        const tagline = block.querySelector("[data-anim='tagline']");
        const title = block.querySelector("[data-anim='title']");
        const body = block.querySelector("[data-anim='body']");
        const icon = block.querySelector("[data-anim='icon']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
            end: "top 35%",
            scrub: 1,
          },
        });

        if (icon) tl.fromTo(icon, { opacity: 0, scale: 0.6, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3 }, 0);
        if (tagline) tl.fromTo(tagline, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, 0.05);
        if (title) tl.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
        if (body) tl.fromTo(body, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.25);
      });
    }, section);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [renderFrame]);

  return (
    <section
      ref={sectionRef}
      id="scrollytelling"
      className="relative"
      style={{ minHeight: "350vh" }}
      data-testid="section-scrollytelling"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">

          <div className="space-y-[45vh] py-[25vh] lg:py-[40vh] order-2 lg:order-1">
            {storyBlocks.map((block, index) => (
              <div
                key={index}
                ref={(el) => { blockRefs.current[index] = el; }}
                className="max-w-lg"
                data-testid={`text-story-block-${index}`}
              >
                <div data-anim="icon" className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-copper/20 to-copper/5 flex items-center justify-center border border-copper/10">
                    <block.icon className="w-6 h-6 text-copper" />
                  </div>
                </div>

                <p data-anim="tagline" className="text-xs font-bold tracking-[0.2em] uppercase text-copper mb-3">
                  {block.tagline}
                </p>

                <h3
                  data-anim="title"
                  className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold leading-[1.1] mb-4 text-charcoal whitespace-pre-line"
                >
                  {block.title}
                </h3>

                <p data-anim="body" className="text-base md:text-lg text-charcoal-light/80 leading-relaxed max-w-sm">
                  {block.text}
                </p>

                {index < storyBlocks.length - 1 && (
                  <div className="mt-10 w-12 h-px bg-copper/20" />
                )}
              </div>
            ))}
          </div>

          <div
            ref={pinnedRef}
            className="hidden lg:flex items-center justify-center h-screen order-1 lg:order-2"
          >
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "700px",
                  height: "700px",
                  background: "radial-gradient(circle, hsla(28, 60%, 48%, 0.06) 0%, hsla(28, 60%, 48%, 0.02) 40%, transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: "500px",
                  height: "500px",
                  background: "radial-gradient(circle, hsla(140, 12%, 78%, 0.05) 0%, transparent 60%)",
                  filter: "blur(30px)",
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
                    filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.12))",
                  }}
                  data-testid="canvas-image-sequence"
                />

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card/80 backdrop-blur-md border border-border/40 rounded-full px-4 py-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-copper animate-pulse" />
                  <span className="text-[11px] font-semibold text-charcoal-light tracking-wider">
                    FRAME <span ref={counterRef} className="text-copper font-bold tabular-nums">01</span> / {FRAME_COUNT}
                  </span>
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 h-[50%] w-[3px] rounded-full bg-sand-dark/20 overflow-hidden">
                <div
                  ref={progressRef}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-copper to-copper-dark rounded-full origin-top"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden py-16 px-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-xl font-extrabold text-white">13</span>
          </div>
          <span className="text-2xl font-extrabold text-charcoal">
            WEB<span className="text-copper">13</span>
          </span>
        </div>
      </div>
    </section>
  );
}
