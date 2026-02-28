import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";

type CursorState = "default" | "hover";

interface CursorContextType {
  setCursorState: (state: CursorState) => void;
}

const CursorContext = createContext<CursorContextType | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  return ctx;
}

export function LiquidCursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const showCustomCursor = mounted && isPointer;

  return (
    <CursorContext.Provider value={{ setCursorState }}>
      {showCustomCursor && (
        <>
          <style>{`
            .liquid-cursor-root * { cursor: none !important; }
            .liquid-cursor-root a, .liquid-cursor-root button { cursor: none !important; }
          `}</style>
          <LiquidCursorInner state={cursorState} setState={setCursorState} />
        </>
      )}
      <div className={showCustomCursor ? "liquid-cursor-root" : ""}>{children}</div>
    </CursorContext.Provider>
  );
}

function LiquidCursorInner({
  state,
  setState,
}: {
  state: CursorState;
  setState: (s: CursorState) => void;
}) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const dotTarget = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      dotTarget.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], [data-cursor-hover]")) setState("hover");
    };
    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = (e as MouseEvent & { relatedTarget?: HTMLElement }).relatedTarget as HTMLElement | null;
      if (!related?.closest?.("a, button, [role='button'], [data-cursor-hover]")) setState("default");
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    const animate = () => {
      const ease = 0.15;
      const dotEase = 0.35;
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;
      dotTarget.current.x += (target.current.x - dotTarget.current.x) * dotEase;
      dotTarget.current.y += (target.current.y - dotTarget.current.y) * dotEase;

      ring.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      dot.style.transform = `translate(${dotTarget.current.x}px, ${dotTarget.current.y}px)`;
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [setState]);

  const size = state === "hover" ? 56 : 32;
  const dotSize = state === "hover" ? 8 : 6;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/60 transition-[width,height] duration-300 ease-out"
        style={{
          width: size,
          height: size,
          left: 0,
          top: 0,
        }}
      />
      <div
        ref={dotRef}
        className="absolute rounded-full bg-primary transition-[width,height] duration-300 ease-out"
        style={{
          width: dotSize,
          height: dotSize,
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}
