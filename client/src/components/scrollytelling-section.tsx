import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Zap, Palette, Rocket, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

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

interface FloatingMockup {
  id: number;
  src: string;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  speed: number;
  width: number;
}

const MOCKUPS: FloatingMockup[] = [
  { id: 0, src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&q=80", x: 2, y: 5, scale: 0.95, opacity: 0.55, zIndex: 3, rotateX: -3, rotateY: 5, rotateZ: -1.5, speed: 0.6, width: 320 },
  { id: 1, src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop&q=80", x: 58, y: 2, scale: 1.05, opacity: 0.45, zIndex: 2, rotateX: 4, rotateY: -6, rotateZ: 2, speed: 0.45, width: 340 },
  { id: 2, src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80", x: 72, y: 22, scale: 0.75, opacity: 0.35, zIndex: 1, rotateX: -5, rotateY: 8, rotateZ: -2.5, speed: 0.3, width: 260 },
  { id: 3, src: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=600&h=400&fit=crop&q=80", x: -5, y: 35, scale: 0.85, opacity: 0.4, zIndex: 2, rotateX: 6, rotateY: -4, rotateZ: 1, speed: 0.55, width: 300 },
  { id: 4, src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop&q=80", x: 45, y: 40, scale: 1.1, opacity: 0.5, zIndex: 4, rotateX: -2, rotateY: 3, rotateZ: -1, speed: 0.7, width: 360 },
  { id: 5, src: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&h=400&fit=crop&q=80", x: 80, y: 50, scale: 0.7, opacity: 0.3, zIndex: 1, rotateX: 7, rotateY: -9, rotateZ: 3, speed: 0.25, width: 240 },
  { id: 6, src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80", x: 15, y: 60, scale: 0.9, opacity: 0.45, zIndex: 3, rotateX: -4, rotateY: 6, rotateZ: -2, speed: 0.5, width: 310 },
  { id: 7, src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop&q=80", x: 60, y: 65, scale: 0.8, opacity: 0.38, zIndex: 2, rotateX: 5, rotateY: -7, rotateZ: 1.5, speed: 0.35, width: 280 },
  { id: 8, src: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=600&h=400&fit=crop&q=80", x: -2, y: 78, scale: 0.75, opacity: 0.32, zIndex: 1, rotateX: -6, rotateY: 4, rotateZ: -3, speed: 0.4, width: 250 },
  { id: 9, src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop&q=80", x: 40, y: 82, scale: 0.95, opacity: 0.42, zIndex: 3, rotateX: 3, rotateY: -5, rotateZ: 2, speed: 0.6, width: 330 },
  { id: 10, src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&q=80", x: 75, y: 88, scale: 0.65, opacity: 0.28, zIndex: 1, rotateX: -8, rotateY: 10, rotateZ: -1, speed: 0.2, width: 220 },
];

export function ScrollytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mockupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const progress = progressRef.current;
    if (!section || !gallery || !progress) return;

    const ctx = gsap.context(() => {
      mockupRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = MOCKUPS[i];
        const direction = i % 2 === 0 ? -1 : 1;
        const yTravel = window.innerHeight * (0.6 + m.speed * 0.8) * direction;

        gsap.fromTo(
          el,
          {
            y: -yTravel * 0.3,
            rotateX: m.rotateX * 0.5,
            rotateY: m.rotateY * 0.5,
            rotateZ: m.rotateZ * 0.5,
          },
          {
            y: yTravel,
            rotateX: m.rotateX * 2.5,
            rotateY: m.rotateY * 2.5,
            rotateZ: m.rotateZ * 2,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
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

    return () => ctx.revert();
  }, []);

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
        ref={galleryRef}
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
        aria-hidden="true"
        data-testid="floating-gallery"
      >
        {MOCKUPS.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => { mockupRefs.current[i] = el; }}
            className="absolute"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: `${m.width}px`,
              zIndex: m.zIndex,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
            data-testid={`mockup-card-${m.id}`}
          >
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                transform: `scale(${m.scale})`,
                opacity: m.opacity,
                boxShadow: `
                  0 4px 6px rgba(0,0,0,0.04),
                  0 10px 25px rgba(0,0,0,0.06),
                  0 25px 60px rgba(0,0,0,0.08),
                  0 0 0 1px rgba(0,0,0,0.04)
                `,
              }}
            >
              <div className="h-6 bg-gradient-to-b from-gray-100 to-gray-50 flex items-center px-2.5 gap-1.5 border-b border-gray-200/60">
                <div className="w-2 h-2 rounded-full bg-red-400/70" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/70" />
                <div className="w-2 h-2 rounded-full bg-green-400/70" />
                <div className="flex-1 mx-2">
                  <div className="h-3 bg-gray-200/80 rounded-full max-w-[60%] mx-auto" />
                </div>
              </div>
              <img
                src={m.src}
                alt=""
                loading="lazy"
                className="w-full aspect-[3/2] object-cover"
                style={{ display: "block" }}
              />
            </div>
          </div>
        ))}
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
              <div className="scrollytelling-glass-card rounded-2xl p-7 sm:p-8 border border-white/25 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, hsla(28, 60%, 48%, 0.04) 0%, transparent 50%)",
                  }}
                />

                <div data-anim="icon" className="flex items-center gap-3 mb-5 relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-copper/20 to-copper/5 flex items-center justify-center border border-copper/15 shadow-sm">
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

                <h3 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold leading-[1.1] mb-4 text-charcoal overflow-hidden relative">
                  {splitIntoWords(block.title)}
                </h3>

                <p data-anim="body" className="text-base md:text-lg text-charcoal-light/80 leading-relaxed relative">
                  {block.text}
                </p>

                {index < storyBlocks.length - 1 && (
                  <div data-anim="divider" className="mt-8 w-16 h-px bg-gradient-to-l from-copper/30 to-transparent origin-right relative" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none">
        <div className="h-32 w-[3px] rounded-full bg-sand-dark/15 overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-copper to-copper-dark rounded-full origin-top"
          />
        </div>
      </div>
    </section>
  );
}
