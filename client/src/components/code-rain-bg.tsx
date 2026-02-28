import { useEffect, useRef } from "react";

const CODE_SNIPPETS = [
  'const app = express();',
  'import React from "react";',
  'function render() {',
  '  return <Component />;',
  'export default App;',
  'const [state, setState] = useState();',
  'useEffect(() => {}, []);',
  'app.listen(3000);',
  '<div className="flex">',
  'const router = useRouter();',
  'async function fetchData() {',
  '  const res = await fetch(url);',
  '  return res.json();',
  'border-radius: 12px;',
  'display: grid;',
  'gap: 1.5rem;',
  'font-weight: 800;',
  'background: linear-gradient(...);',
  'transition: all 0.3s ease;',
  'const db = drizzle(pool);',
  'SELECT * FROM users;',
  'npm run build',
  'git commit -m "deploy"',
  'docker compose up -d',
  'animation: fadeIn 0.5s ease;',
  'position: relative;',
  'transform: translateY(0);',
  'padding: 2rem 3rem;',
  'color: hsl(220 80% 65%);',
  'requestAnimationFrame(loop)',
];

export function CodeRainBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const colCount = isMobile ? 8 : 20;
    const fontSize = 10;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const colWidth = width / colCount;

    // בנה עמודות
    type Column = {
      lines: string[];
      y: number;
      speed: number;
      direction: number;
    };

    const columns: Column[] = Array.from({ length: colCount }, (_, i) => ({
      lines: Array.from({ length: isMobile ? 18 : 35 }, (_, j) =>
        CODE_SNIPPETS[(i * 7 + j) % CODE_SNIPPETS.length]
      ),
      y: Math.random() * -height,
      speed: isMobile ? 0.4 + Math.random() * 0.3 : 0.25 + Math.random() * 0.3,
      direction: i % 3 === 0 ? 1 : -1,
    }));

    let animId: number;
    let lastTime = 0;

    const draw = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px Menlo, Monaco, 'Courier New', monospace`;

      columns.forEach((col, i) => {
        col.y += col.speed * col.direction * (delta / 16);

        const totalH = col.lines.length * (fontSize * 1.5);
        if (col.y > totalH) col.y = -height;
        if (col.y < -totalH) col.y = height;

        col.lines.forEach((line, j) => {
          const brightness = 0.08 + (j % 3) * 0.04;
          ctx.fillStyle = `hsla(220, 70%, 68%, ${brightness})`;
          ctx.fillText(
            line,
            i * colWidth + 4,
            col.y + j * fontSize * 1.5,
            colWidth - 8
          );
        });
      });

      animId = requestAnimationFrame(draw);
    };

    // התחל רק אחרי שהדף נטען
    const start = () => { animId = requestAnimationFrame(draw); };
    if (document.readyState === "complete") {
      setTimeout(start, 300);
    } else {
      window.addEventListener("load", () => setTimeout(start, 300), { once: true });
    }

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: "100%",
        height: "100%",
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 65%)",
      }}
      aria-hidden="true"
    />
  );
}
