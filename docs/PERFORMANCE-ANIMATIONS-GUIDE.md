# Animation & Performance Guide — 60 FPS & Core Web Vitals

Technical guide for achieving 60 FPS and strong Core Web Vitals using hardware acceleration, `will-change`, `requestAnimationFrame`, debounce/throttle, and CSS containment.

---

## 1. Hardware Acceleration: `transform` & `opacity` Only

**Why:** Animating `top`, `left`, `width`, `height`, or `box-shadow` triggers **layout** and **paint** on every frame. `transform` and `opacity` are **compositor-only**: the browser moves a layer on the GPU without recalculating layout or full repaint.

### Before (causes layout thrashing)

```css
.box {
  position: absolute;
  top: 0;
  left: 0;
}
.box.animate {
  top: 100px;
  left: 200px;
  width: 300px;
  height: 200px;
}
```

```js
// Triggers layout + paint every frame
element.style.left = x + "px";
element.style.top = y + "px";
element.style.width = w + "px";
```

### After (GPU-friendly, 60 FPS)

```css
.box {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform; /* optional hint; remove when animation ends */
}
.box.animate {
  transform: translate(200px, 100px) scale(1.5); /* scale instead of width/height */
}
```

```js
// Only compositor work — no layout
element.style.transform = `translate(${x}px, ${y}px)`;
element.style.opacity = opacity;
```

**Rule of thumb:** Move with `translate(x, y)` or `translate3d(x, y, 0)`, resize with `scale()`, fade with `opacity`. Avoid animating `top/left/width/height` in JS-driven or keyframe animations.

---

## 2. CSS `will-change` — Correct Usage

**Why:** `will-change` tells the browser to promote the element to its own layer in advance. Overuse wastes memory and can hurt performance; use only for elements that **will** animate soon and remove when done.

### Before (no hint or overuse)

```css
/* No hint — browser may not layer until first frame */
.hero-image { transform: scale(1); }

/* BAD: will-change on many elements */
.card { will-change: transform; }
.list li { will-change: transform; }
```

### After (targeted and temporary)

```css
/* Hint only for elements that animate on scroll/hover */
.reveal-on-scroll {
  will-change: transform, opacity;
}
/* Remove after animation (e.g. via JS or one-off class) */
.reveal-on-scroll.done {
  will-change: auto;
}
```

```js
// Add will-change just before animating, remove after
el.style.willChange = "transform, opacity";
requestAnimationFrame(() => {
  el.style.transform = "translateY(0)";
  el.style.opacity = "1";
});
el.ontransitionend = () => {
  el.style.willChange = "auto";
};
```

**Rules:** Use for one or a few elements; prefer `transform` and `opacity`; set to `auto` when the animation ends.

---

## 3. `requestAnimationFrame` Instead of `setTimeout` / `setInterval`

**Why:** `requestAnimationFrame` runs right before the next repaint, synced to the display (usually 60 FPS). `setTimeout`/`setInterval` are not tied to frames and can cause jank and wasted work.

### Before (setInterval — can desync and drop frames)

```js
let x = 0;
const id = setInterval(() => {
  x += 2;
  element.style.transform = `translateX(${x}px)`;
  if (x >= 200) clearInterval(id);
}, 16);
```

### After (requestAnimationFrame — synced to display)

```js
let x = 0;
function tick() {
  x += 2;
  element.style.transform = `translateX(${x}px)`;
  if (x < 200) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

### Before (setTimeout for scroll-driven updates)

```js
window.addEventListener("scroll", () => {
  setTimeout(() => updateParallax(), 0);
});
```

### After (RAF for scroll)

```js
let rafId = null;
window.addEventListener("scroll", () => {
  if (rafId != null) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    updateParallax();
    rafId = null;
  });
}, { passive: true });
```

---

## 4. Debouncing & Throttling for Scroll and Resize

**Why:** Scroll and resize fire very often. Throttling limits how often your handler runs (e.g. once per frame with RAF). Debouncing runs the handler only after a pause in events.

### Utility: throttle (e.g. once per 16ms or per RAF)

```js
function throttle(fn, limitMs = 16) {
  let last = 0;
  let rafId = null;
  return function throttled(...args) {
    const now = Date.now();
    const elapsed = now - last;
    if (elapsed >= limitMs) {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        last = Date.now();
        fn.apply(this, args);
        rafId = null;
      });
    }
  };
}
```

### Utility: debounce (run after events stop)

```js
function debounce(fn, delayMs) {
  let timeoutId = null;
  return function debounced(...args) {
    if (timeoutId != null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delayMs);
  };
}
```

### Before (no throttle — runs hundreds of times per second)

```js
window.addEventListener("scroll", () => {
  updateParallax();
});
window.addEventListener("resize", () => {
  recalcLayout();
});
```

### After (throttle scroll, debounce resize)

```js
const throttledParallax = throttle(updateParallax, 16);
const debouncedLayout = debounce(recalcLayout, 150);

window.addEventListener("scroll", throttledParallax, { passive: true });
window.addEventListener("resize", debouncedLayout);
```

---

## 5. CSS `contain` — Limit Layout/Paint Scope

**Why:** `contain` tells the browser that an element’s layout, paint, or style are isolated from the rest of the tree. That reduces how much of the DOM is recalculated when something inside changes.

### Property values (simplified)

- `contain: layout` — layout of descendants doesn’t affect outside.
- `contain: paint` — descendants don’t paint outside the element (like overflow: hidden for paint).
- `contain: strict` — layout + paint + style (use where safe).

### Before (no containment — full tree can be affected)

```css
.card {
  padding: 1rem;
  border-radius: 8px;
}
.card .animated-badge {
  transform: scale(1.1);
}
```

### After (containment for animated / changing blocks)

```css
.card {
  contain: layout paint;
  padding: 1rem;
  border-radius: 8px;
}
.card .animated-badge {
  will-change: transform;
  transform: scale(1.1);
}
```

### Good candidates for `contain`

- Scroll-driven sections (e.g. each “block” of the page).
- Cards or list items that animate independently.
- Modals or overlays.

**Caution:** `contain: strict` can affect positioning (e.g. fixed) and stacking; prefer `layout paint` where possible.

---

## Quick reference

| Goal              | Do                                         | Avoid                          |
|------------------|---------------------------------------------|--------------------------------|
| Move / resize    | `transform`, `opacity`                      | `top`, `left`, `width`, `height` |
| Hint animation   | `will-change` for 1–2 props, remove after   | `will-change` on many elements |
| Timers for UI    | `requestAnimationFrame`                    | `setTimeout`/`setInterval` for frames |
| Scroll/resize    | Throttle (e.g. RAF) or debounce            | Raw handler every event        |
| Isolate work     | `contain: layout paint` on containers      | Overuse of `contain: strict`  |

Using these patterns together helps achieve 60 FPS and better LCP, INP, and CLS on Core Web Vitals.

---

## In this project

- **Throttle / debounce / RAF schedule:** `client/src/lib/performance.ts` — use `throttle(fn, 16)` for scroll, `debounce(fn, 150)` for resize.
- **Scroll-driven updates:** `scroll-background.tsx` already uses `requestAnimationFrame` and `transform` (no `top`/`left`).
- **Motion config:** `client/src/lib/igloo-motion.ts` — shared durations and easing for Framer Motion and GSAP.
