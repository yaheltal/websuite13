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
  z: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  speed: number;
  width: number;
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

    const depthLayer = i % 3;
    const baseOpacity = depthLayer === 0 ? 0.2 : depthLayer === 1 ? 0.35 : 0.5;
    const baseScale = depthLayer === 0 ? 0.5 : depthLayer === 1 ? 0.7 : 0.9;
    const baseWidth = depthLayer === 0 ? 180 : depthLayer === 1 ? 260 : 340;
    const baseZ = depthLayer === 0 ? -400 : depthLayer === 1 ? -150 : 0;

    return {
      id: i,
      src: `https://images.unsplash.com/${UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length]}?w=500&h=340&fit=crop&q=75`,
      x: -15 + s1 * 115,
      y: s2 * 95,
      z: baseZ + (s5 - 0.5) * 200,
      scale: baseScale + s3 * 0.25,
      opacity: baseOpacity + s4 * 0.15,
      zIndex: depthLayer + 1,
      rotateX: -8 + s1 * 16,
      rotateY: -10 + s2 * 20,
      rotateZ: -3 + s3 * 6,
      speed: 0.15 + s5 * 0.55,
      width: baseWidth + Math.floor(s4 * 60),
    };
  });
}

const MOCKUPS = generateMockups(25);

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

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      mockupRefs.current.forEach((el, i) => {
        if (!el) return;
        const m = MOCKUPS[i];
        const direction = i % 2 === 0 ? -1 : 1;
        const yTravel = window.innerHeight * (0.5 + m.speed * 0.9) * direction;
        const mobileFactor = isMobile ? 0.6 : 1;
        const zDrift = (m.z * 0.3) * (i % 2 === 0 ? 1 : -1);

        gsap.fromTo(
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
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
        aria-hidden="true"
        data-testid="floating-gallery"
      >
        {MOCKUPS.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => { mockupRefs.current[i] = el; }}
            className="absolute mockup-float-card"
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
              <div className="h-5 sm:h-6 bg-gradient-to-b from-gray-100 to-gray-50 flex items-center px-2 gap-1 sm:gap-1.5 border-b border-gray-200/60">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400/70" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-400/70" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400/70" />
                <div className="flex-1 mx-1 sm:mx-2">
                  <div className="h-2.5 sm:h-3 bg-gray-200/80 rounded-full max-w-[60%] mx-auto" />
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
              <div className="scrollytelling-glass-card rounded-2xl p-7 sm:p-8 border border-white/30 shadow-2xl backdrop-blur-xl">
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

                <p data-anim="body" className="text-base md:text-lg text-charcoal/75 leading-relaxed relative">
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
