import { useEffect, useRef } from "react";
import { gsap } from "gsap";

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
  'CREATE TABLE projects (',
  '  id SERIAL PRIMARY KEY,',
  '  name VARCHAR(255)',
  ');',
  'npm run build',
  'git commit -m "deploy"',
  'docker compose up -d',
  '@media (max-width: 768px) {',
  'justify-content: center;',
  'opacity: 0.95;',
  'z-index: 10;',
  'const theme = { primary: "#3b82f6" };',
  'animation: fadeIn 0.5s ease;',
  'box-shadow: 0 4px 20px rgba(...);',
  'position: relative;',
  'transform: translateY(0);',
  'will-change: transform;',
  'padding: 2rem 3rem;',
  'letter-spacing: -0.02em;',
  'color: hsl(220 80% 65%);',
  '<section id="hero">',
  'className="text-white"',
  'onClick={handleSubmit}',
  'type Query { user: User }',
  'mutation { createProject }',
  'resolver: { Query: { ... } }',
  'module.exports = config;',
  'plugins: [react()],',
  'server { listen 443 ssl; }',
];

const COLUMN_COUNT = 8;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CodeRainBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const columns: HTMLDivElement[] = [];

    for (let col = 0; col < COLUMN_COUNT; col++) {
      const column = document.createElement("div");
      column.style.cssText = `
        position: absolute;
        top: 0;
        left: ${(col / COLUMN_COUNT) * 100}%;
        width: ${100 / COLUMN_COUNT}%;
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 0 8px;
        white-space: nowrap;
        overflow: hidden;
      `;

      const lines = shuffleArray(CODE_SNIPPETS).slice(0, 14 + Math.floor(Math.random() * 6));
      lines.forEach((line) => {
        const el = document.createElement("div");
        el.textContent = line;
        el.style.cssText = `
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 11px;
          line-height: 1.6;
          color: hsla(220, 60%, 65%, 0.12);
          opacity: 0;
        `;
        column.appendChild(el);
      });

      container.appendChild(column);
      columns.push(column);
    }

    const ctx = gsap.context(() => {
      columns.forEach((column, colIdx) => {
        const children = column.children;
        const delay = colIdx * 0.4 + Math.random() * 0.5;

        gsap.fromTo(
          children,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            delay,
            ease: "power1.out",
          }
        );

        const speed = 25 + Math.random() * 15;
        const totalH = column.scrollHeight + 100;

        gsap.set(column, { y: 0 });
        gsap.to(column, {
          y: -totalH / 2,
          duration: speed,
          ease: "none",
          repeat: -1,
          delay: delay + 1.5,
        });
      });
    }, container);

    return () => {
      ctx.revert();
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)",
        opacity: 0.9,
      }}
      aria-hidden="true"
    />
  );
}
