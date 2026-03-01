import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { EASE_OUT_SMOOTH, DURATION } from "@/lib/igloo-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VIDEOS = [
  {
    src: "/videos/ecommerce-video-ad.mp4",
    title: "יצירת פרסומת וידאו לאתר איקומרס",
    description: "צפו איך בונים פרסומת וידאו מקצועית לחנות אונליין",
  },
  {
    src: "/videos/serious-website-build.mp4",
    title: "בניית אתר רציני ומורכב",
    description: "תהליך בניית אתר מקצועי משלב לתשלום",
  },
  {
    src: "/videos/text-to-video-1.mp4",
    title: "וידאו מטקסט",
    description: "המרת טקסט לווידאו עם כלי בינה מלאכותית",
  },
  {
    src: "/videos/text-to-video-2.mp4",
    title: "וידאו מקצועי מטקסט",
    description: "יצירת וידאו פרופסיונלי מתיאור טקסטואלי",
  },
] as const;

function VideoSlidePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-center mb-2">
        <h3 className="text-xl md:text-2xl font-bold text-charcoal">{title}</h3>
        <p className="text-charcoal-light mt-1">{description}</p>
      </div>
      <div className="relative rounded-2xl overflow-hidden border border-border/20 bg-charcoal/10 aspect-video w-full mx-auto" aria-hidden="true" />
    </div>
  );
}

export function VideoSection() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    return () => api.off("select");
  }, [api]);

  // נגן וידאו יחיד – מחליף מקור כשמחליפים סלייד, מונע תקיעות
  useEffect(() => {
    const el = videoRef.current;
    const video = VIDEOS[current];
    if (!el || !video) return;
    el.muted = true;
    el.src = video.src;
    el.load();
    const played = el.play();
    played.catch(() => {});
    const onEnd = () => api?.scrollNext();
    const onErr = () => api?.scrollNext();
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", onErr);
    return () => {
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("error", onErr);
    };
  }, [current, api]);

  return (
    <section
      className="py-28 md:py-36 relative bg-charcoal/5"
      data-testid="section-video"
      aria-labelledby="video-heading"
    >
      <div className="absolute inset-0 bg-background/40 rounded-3xl pointer-events-none" />
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: DURATION.normal, ease: EASE_OUT_SMOOTH }}
          className="text-center mb-10"
        >
          <h2
            id="video-heading"
            className="text-2xl md:text-3xl font-bold text-charcoal mb-2"
          >
            סרטוני הדגמה
          </h2>
          <p className="text-charcoal-light text-lg">
            צפו בתהליכי העבודה והפרויקטים שלנו
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: DURATION.normal, ease: EASE_OUT_SMOOTH }}
          className="flex items-center gap-3 md:gap-6"
          dir="ltr"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 h-12 w-12 md:h-14 md:w-14 rounded-full border-2 shadow-lg bg-background hover:bg-muted order-1"
            onClick={() => api?.scrollPrev()}
            disabled={!api}
            aria-label="סרטון קודם"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </Button>

          <div className="flex-1 min-w-0 order-2 w-full relative">
            <Carousel setApi={setApi} opts={{ align: "center", loop: true, skipSnaps: false }}>
              <CarouselContent className="mr-0 -ml-3 md:-ml-5">
                {VIDEOS.map((video) => (
                  <CarouselItem key={video.src} className="pl-3 md:pl-5 basis-[92%] sm:basis-[90%] md:basis-[85%] lg:basis-[82%]">
                    <VideoSlidePlaceholder title={video.title} description={video.description} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* נגן וידאו יחיד – מונע תקיעות */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-3 md:px-5">
              <div className="w-[92%] sm:w-[90%] md:w-[85%] lg:w-[82%] aspect-video max-w-full rounded-2xl overflow-hidden shadow-xl border border-border/20 bg-charcoal/5 pointer-events-auto">
                <video
                  ref={videoRef}
                  controls
                  playsInline
                  muted
                  preload="auto"
                  className="w-full h-full object-contain"
                  aria-label={`וידאו: ${VIDEOS[current]?.title ?? ""}`}
                >
                  <track kind="captions" />
                  הדפדפן שלך לא תומך בוידאו.
                </video>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 h-12 w-12 md:h-14 md:w-14 rounded-full border-2 shadow-lg bg-background hover:bg-muted order-3"
            onClick={() => api?.scrollNext()}
            disabled={!api}
            aria-label="סרטון הבא"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </Button>
        </motion.div>

        {VIDEOS.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
              {VIDEOS.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`עבור לסרטון ${index + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-200",
                    current === index
                      ? "w-6 bg-copper"
                      : "w-2 bg-charcoal/30 hover:bg-charcoal/50"
                  )}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
