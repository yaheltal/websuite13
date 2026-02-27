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
  'if (err) throw err;',
  'req.body.email',
  'res.status(200).json(data);',
  'margin: 0 auto;',
  'overflow: hidden;',
  'cursor: pointer;',
  'const API = "/api/v1";',
  'headers: { "Content-Type": "application/json" }',
  'try { await save(); } catch(e) {}',
  'router.get("/", handler);',
  'WHERE id = $1',
  'ORDER BY created_at DESC',
  'LIMIT 50 OFFSET 0',
  'INSERT INTO leads VALUES',
  'UPDATE projects SET status',
  'flex-direction: column;',
  'align-items: center;',
  'text-align: center;',
  'max-width: 1200px;',
  'border: 1px solid rgba(...);',
  'backdrop-filter: blur(20px);',
  'const token = jwt.sign(payload);',
  'bcrypt.compare(password, hash);',
  'process.env.DATABASE_URL',
  'export const schema = pgTable(...);',
  'app.use(cors({ origin: "*" }));',
  'console.log("Server ready");',
  'npm install --save',
  'yarn add @tanstack/react-query',
  'pnpm exec drizzle-kit push',
  'const ctx = gsap.context(() => {});',
  'tl.to(el, { opacity: 1 });',
  'gsap.fromTo(chars, {...});',
  'ease: "power3.out"',
  'stagger: 0.04',
  'duration: 0.8',
  'repeat: -1',
  'yoyo: true',
  'delay: 0.2',
  '.then(data => setData(data))',
  'catch(err => console.error(err))',
  'Promise.all([...requests])',
  'async/await pattern',
  'middleware(req, res, next)',
  'session.destroy()',
  'cookie: { secure: true }',
  'ssl: { rejectUnauthorized: false }',
  'pool.query(sql, params)',
  'rows.map(r => r.name)',
  'JSON.stringify(obj)',
  'Object.keys(config)',
  'Array.from(nodeList)',
  'document.querySelector("#app")',
  'window.scrollTo({ top: 0 })',
  'addEventListener("click", fn)',
  'removeEventListener("resize")',
  'IntersectionObserver(callback)',
  'requestAnimationFrame(loop)',
  'performance.now()',
  'crypto.randomUUID()',
];

const COLUMN_COUNT = 20;

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
        gap: 3px;
        padding: 0 4px;
        white-space: nowrap;
        overflow: hidden;
      `;

      const lineCount = 30 + Math.floor(Math.random() * 15);
      const lines = shuffleArray(CODE_SNIPPETS).slice(0, Math.min(lineCount, CODE_SNIPPETS.length));
      while (lines.length < lineCount) {
        lines.push(...shuffleArray(CODE_SNIPPETS).slice(0, lineCount - lines.length));
      }

      lines.forEach((line) => {
        const el = document.createElement("div");
        el.textContent = line;
        const brightness = 0.1 + Math.random() * 0.12;
        el.style.cssText = `
          font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
          font-size: 10px;
          line-height: 1.5;
          color: hsla(220, 70%, 68%, ${brightness});
        `;
        column.appendChild(el);
      });

      container.appendChild(column);
      columns.push(column);
    }

    const ctx = gsap.context(() => {
      columns.forEach((column, colIdx) => {
        const speed = 6 + Math.random() * 8;
        const totalH = column.scrollHeight;
        const startDelay = colIdx * 0.15 + Math.random() * 0.3;
        const direction = colIdx % 3 === 0 ? 1 : -1;

        if (direction === 1) {
          gsap.set(column, { y: 0 });
          gsap.to(column, {
            y: -totalH / 2,
            duration: speed,
            ease: "none",
            repeat: -1,
            delay: startDelay,
          });
        } else {
          gsap.set(column, { y: -totalH / 2 });
          gsap.to(column, {
            y: 0,
            duration: speed,
            ease: "none",
            repeat: -1,
            delay: startDelay,
          });
        }
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
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 65%)",
      }}
      aria-hidden="true"
    />
  );
}
