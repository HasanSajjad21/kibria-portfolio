/** Small math + motion helpers shared by the scroll-driven sections. */

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** cubic ease-in-out */
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** cubic ease-out */
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/** Hermite smoothstep between e0 and e1 */
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** True when the visitor asked the OS to minimise motion. Safe to call during SSR. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fires `cb` once web fonts are ready (no-op where the API is missing). */
export const onFontsReady = (cb: () => void) => {
  if (typeof document !== 'undefined' && document.fonts) document.fonts.ready.then(cb);
};
