import { useEffect, useRef, useCallback } from "react";

// --- Theme colors ---
const PALETTE = [
  { r: 184, g: 115, b: 51 },   // copper
  { r: 124, g: 58, b: 237 },   // purple
  { r: 59, g: 130, b: 246 },   // blue
  { r: 168, g: 85, b: 247 },   // violet
  { r: 217, g: 149, b: 75 },   // warm copper
];

interface Particle {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  baseSize: number;
  color: { r: number; g: number; b: number };
  baseOpacity: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitTilt: number;
}

function createParticle(width: number, height: number, zRange: number): Particle {
  const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return {
    x: (Math.random() - 0.5) * width * 1.4,
    y: (Math.random() - 0.5) * height * 1.4,
    z: Math.random() * zRange - zRange / 2,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    vz: (Math.random() - 0.5) * 0.15,
    baseSize: 2 + Math.random() * 3,
    color,
    baseOpacity: 0.3 + Math.random() * 0.5,
    orbitRadius: 20 + Math.random() * 60,
    orbitSpeed: 0.0002 + Math.random() * 0.0006,
    orbitTilt: Math.random() * Math.PI,
    orbitPhase: Math.random() * Math.PI * 2,
  };
}

export function Hero3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const visibleRef = useRef(true);

  const getConfig = useCallback(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    return {
      count: mobile ? 10 : 16,
      connDist: mobile ? 55 : 70,
      connOpacity: 0.04,
      mouseInfluence: 0.03,
      zRange: mobile ? 250 : 350,
      perspective: 800,
      glowLayers: 0,
      targetFps: mobile ? 12 : 15,
    };
  }, []);

  const configRef = useRef(getConfig());

  const init = useCallback((width: number, height: number) => {
    const cfg = configRef.current;
    particlesRef.current = Array.from({ length: cfg.count }, () =>
      createParticle(width, height, cfg.zRange)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => { reducedMotion = e.matches; };
    motionQuery.addEventListener("change", handleMotionChange);

    // Intersection Observer: pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    init(width, height);

    window.addEventListener("resize", resize, { passive: true });

    // Mouse tracking (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      
      mouseRef.current.x = (e.clientX / width - 0.5) * 2;
      mouseRef.current.y = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const cfg = configRef.current;
    const frameInterval = 1000 / cfg.targetFps;
    let lastFrame = 0;
    let lastTime = 0;

    const draw = (timestamp: number) => {
      animRef.current = requestAnimationFrame(draw);

      // Skip if not visible (saves 100% CPU when offscreen)
      if (!visibleRef.current) return;

      // Frame rate throttle
      if (timestamp - lastFrame < frameInterval) return;
      lastFrame = timestamp;

      const dt = lastTime ? Math.min(timestamp - lastTime, 50) : 16;
      lastTime = timestamp;
      timeRef.current += dt;

      const time = timeRef.current;
      const particles = particlesRef.current;
      const cx = width / 2;
      const cy = height / 2;

      // Mouse smooth
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.06;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.06;
      const parallaxX = mouse.smoothX * width * cfg.mouseInfluence;
      const parallaxY = mouse.smoothY * height * cfg.mouseInfluence;

      const globalAngle = reducedMotion ? 0 : time * 0.0003;
      const cosA = Math.cos(globalAngle);
      const sinA = Math.sin(globalAngle);

      ctx.clearRect(0, 0, width, height);

      // Update & project
      const halfZ = cfg.zRange / 2;
      const halfW = width * 0.7;
      const halfH = height * 0.7;

      const proj: { sx: number; sy: number; z: number; size: number; opacity: number; color: typeof PALETTE[0] }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotion) {
          const orbitAngle = time * p.orbitSpeed + p.orbitPhase;
          p.x += (p.vx + Math.cos(orbitAngle) * p.orbitRadius * 0.01) * (dt / 16);
          p.y += (p.vy + Math.sin(orbitAngle) * p.orbitRadius * Math.cos(p.orbitTilt) * 0.01) * (dt / 16);
          p.z += (p.vz + Math.sin(orbitAngle) * p.orbitRadius * Math.sin(p.orbitTilt) * 0.01) * (dt / 16);
        }

        // Wrap
        if (p.x > halfW) p.x = -halfW;
        if (p.x < -halfW) p.x = halfW;
        if (p.y > halfH) p.y = -halfH;
        if (p.y < -halfH) p.y = halfH;
        if (p.z > halfZ) p.z = -halfZ;
        if (p.z < -halfZ) p.z = halfZ;

        const rx = p.x * cosA - p.z * sinA;
        const rz = p.x * sinA + p.z * cosA;
        const depthFactor = (p.z + halfZ) / cfg.zRange;
        const px = rx + parallaxX * (0.3 + depthFactor * 0.7);
        const py = p.y + parallaxY * (0.3 + depthFactor * 0.7);

        const zOff = rz + cfg.perspective;
        const scale = cfg.perspective / Math.max(zOff, 1);
        const sx = px * scale + cx;
        const sy = py * scale + cy;
        const dNorm = Math.max(0, Math.min(1, depthFactor));
        const size = p.baseSize * scale * (0.4 + dNorm * 0.6);
        const opacity = p.baseOpacity * (0.15 + dNorm * 0.85) * Math.min(scale, 1.2);

        if (sx < -30 || sx > width + 30 || sy < -30 || sy > height + 30 || size < 0.3) continue;

        proj.push({ sx, sy, z: rz, size, opacity: Math.min(opacity, 0.85), color: p.color });
      }

      proj.sort((a, b) => a.z - b.z);

      // Draw connections (skip on mobile for perf)
      {
        const connDistSq = cfg.connDist * cfg.connDist;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < proj.length; i++) {
          const a = proj[i];
          for (let j = i + 1; j < proj.length; j++) {
            const b = proj[j];
            const dx = a.sx - b.sx;
            const dy = a.sy - b.sy;
            const distSq = dx * dx + dy * dy;
            if (distSq < connDistSq) {
              const dist = Math.sqrt(distSq);
              const lineOp = (1 - dist / cfg.connDist) * cfg.connOpacity * Math.min(a.opacity, b.opacity) * 2.5;
              if (lineOp < 0.005) continue;
              ctx.strokeStyle = `rgba(${a.color.r}, ${a.color.g}, ${a.color.b}, ${lineOp})`;
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];

        // Glow (desktop only)
        if (cfg.glowLayers > 0) {
          const glowSize = p.size * 2.5;
          const glowOp = p.opacity * 0.12;
          if (glowOp > 0.003) {
            const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowSize);
            grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${glowOp})`);
            grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, glowSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Core dot
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fill();

        // White core for larger dots
        if (p.size > 1.5) {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const startTimer = setTimeout(() => {
      animRef.current = requestAnimationFrame(draw);
    }, 200);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [init, getConfig]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%", zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
