import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Palette, Rocket, Shield } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const storyBlocks = [
  {
    icon: Sparkles,
    title: "עיצוב ללא פשרות",
    text: "כל פיקסל מתוכנן בקפידה. אנחנו לא משתמשים בתבניות מוכנות — כל אתר נבנה מאפס, בדיוק לפי החזון שלכם. עיצוב בוטיק שמרגיש פרימיום.",
  },
  {
    icon: Zap,
    title: "ביצועים בלי תירוצים",
    text: "מהירות טעינה מושלמת, ציון 100 ב-Google PageSpeed. האתרים שלנו בנויים עם הטכנולוגיות הכי מתקדמות — כדי שהלקוחות שלכם לא יחכו אפילו שנייה.",
  },
  {
    icon: Palette,
    title: "חוויית משתמש שמוכרת",
    text: "כל אלמנט באתר שלכם מתוכנן להמרה. מהכפתור הראשון ועד לדף התשלום — אנחנו בונים מסלולים שהופכים מבקרים ללקוחות משלמים.",
  },
  {
    icon: Rocket,
    title: "השקה מהירה ומדויקת",
    text: "תהליך עבודה שקוף ומהיר. מהבריף הראשוני ועד לעלייה לאוויר — תוך ימים בודדים, לא שבועות. בלי הפתעות, בלי עיכובים.",
  },
  {
    icon: Shield,
    title: "ליווי מלא אחרי ההשקה",
    text: "לא נעלמים אחרי שהאתר עולה. תמיכה טכנית, עדכוני אבטחה, ואופטימיזציה שוטפת — כדי שהאתר שלכם תמיד ברמה הכי גבוהה.",
  },
];

export function ScrollytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const visual = visualRef.current;
    const progress = progressRef.current;
    if (!section || !pinned || !visual || !progress) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: pinned,
        pinSpacing: false,
      });

      gsap.to(visual, {
        rotateY: 360,
        rotateX: 15,
        scale: 1.05,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      gsap.fromTo(
        progress,
        { scaleY: 0 },
        {
          scaleY: 1,
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
        gsap.fromTo(
          block,
          { opacity: 0, x: 40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: block,
              start: "top 75%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scrollytelling"
      className="relative"
      style={{ minHeight: "300vh" }}
      data-testid="section-scrollytelling"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-[40vh] py-[20vh] lg:py-[30vh] order-2 lg:order-1">
            {storyBlocks.map((block, index) => (
              <div
                key={index}
                ref={(el) => { blockRefs.current[index] = el; }}
                className="max-w-md"
                data-testid={`text-story-block-${index}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-copper/15 to-copper/5 flex items-center justify-center">
                    <block.icon className="w-5 h-5 text-copper" />
                  </div>
                  <Badge variant="secondary" className="bg-copper/8 text-copper-dark border-copper/15 text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-charcoal">
                  {block.title}
                </h3>
                <p className="text-base md:text-lg text-charcoal-light leading-relaxed">
                  {block.text}
                </p>
              </div>
            ))}
          </div>

          <div
            ref={pinnedRef}
            className="hidden lg:flex items-center justify-center h-screen order-1 lg:order-2"
          >
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <div className="absolute right-4 top-1/2 -translate-y-1/2 h-[60%] w-[3px] rounded-full bg-sand-dark/30 overflow-hidden">
                <div
                  ref={progressRef}
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-copper to-copper-dark rounded-full origin-top"
                />
              </div>

              <div
                ref={visualRef}
                className="w-64 h-64 md:w-72 md:h-72 rounded-2xl relative"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
                data-testid="visual-pinned-box"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-copper/20 via-copper/10 to-sage/10 border border-copper/20 shadow-2xl" />

                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "radial-gradient(hsl(220 15% 18% / 0.4) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center shadow-lg">
                    <span className="text-xl font-extrabold text-white">13</span>
                  </div>
                  <span className="text-2xl font-extrabold text-charcoal">
                    WEB<span className="text-copper">13</span>
                  </span>
                  <p className="text-xs text-charcoal-light">שוברים את השוק</p>
                </div>

                <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full bg-copper/[0.06] blur-xl" />
                <div className="absolute -bottom-3 -left-3 w-24 h-24 rounded-full bg-sage/[0.08] blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
