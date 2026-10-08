'use client';

import { type RefObject, useEffect, useRef } from 'react';
import { clamp, easeInOut as ease, easeOut, lerp, onFontsReady, prefersReducedMotion } from '@/lib/motion';
import { useLatest } from '@/hooks/useLatest';

// stack slots from the Figma frame: scale and top offset of each card behind the front one
const SLOTS = [{ s: 1, y: 0, dim: 0 }, { s: 0.9044, y: 100, dim: 0.2 }, { s: 0.8263, y: 186, dim: 0.36 }];
const SLOTS_M = [{ s: 1, y: 0, dim: 0 }, { s: 0.94, y: 22, dim: 0.2 }, { s: 0.88, y: 42, dim: 0.36 }];
const FLIP = 0.7; // share of each step spent flipping; the rest holds the new card at full size
const STACK_W = 1140, STACK_H = 678;

/**
 * Notepad flip. The stack is pinned while its track scrolls past; progress drives two flips:
 * the front card hinges on its top edge and swings up toward the viewer, while the card
 * behind comes forward into the front slot. Every value is a function of the eased scroll
 * position, so scrolling back reverses it exactly. Scroll only drives it once `ready`
 * (after the entrance has played).
 */
export function useCardStack(sectionRef: RefObject<HTMLElement | null>, ready: boolean) {
  const readyRef = useLatest(ready);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const sw = sectionRef.current;
    if (!sw) return;
    const reduce = prefersReducedMotion();
    const track = sw.querySelector<HTMLElement>('.sw-track')!;
    const stage = sw.querySelector<HTMLElement>('.sw-stage')!;
    const head = sw.querySelector<HTMLElement>('.sw-head')!;
    const pin = sw.querySelector<HTMLElement>('.sw-pin')!;
    const cards = ['uh', 'ie', 'ed'].map((k) => sw.querySelector<HTMLElement>(`.sw-${k}`)!);
    const mobile = () => window.innerWidth <= 760;
    let sc = 1, target = 0, cur = 0, raf = 0, inView = false;

    function fit() {
      // header + gap + card stack, centred together in the pinned view
      const W = sw!.clientWidth, H = window.innerHeight, hH = head.offsetHeight, GAP = mobile() ? 32 : 48;
      if (mobile()) {
        sc = 1;
        stage.style.removeProperty('--sc');
        const top = 56, sh = Math.min(580, H - top - hH - GAP - 64);
        pin.style.setProperty('--ht', top + 'px');
        stage.style.setProperty('--st', top + hH + GAP + 'px');
        stage.style.setProperty('--sh', Math.max(360, sh) + 'px');
        return;
      }
      // as wide as the screen allows (clear of the side nav), but header + stack must fit in height
      const side = W >= 1100 ? 96 : 56;
      sc = Math.min((W - 2 * side) / STACK_W, (H - hH - GAP - 48) / STACK_H);
      const top = Math.max(24, (H - (hH + GAP + STACK_H * sc)) / 2);
      pin.style.setProperty('--ht', top.toFixed(1) + 'px');
      stage.style.setProperty('--st', (top + hH + GAP).toFixed(1) + 'px');
      stage.style.setProperty('--sc', sc.toFixed(4));
    }
    function measure() {
      if (!readyRef.current) { target = 0; return; }
      const r = track.getBoundingClientRect(), run = r.height - window.innerHeight;
      const raw = clamp(-r.top / Math.max(1, run));
      target = clamp((raw - 0.06) / 0.86) * 2; // short holds at both ends
    }
    function slot(k: number) {
      const S = mobile() ? SLOTS_M : SLOTS, a = Math.min(1, Math.floor(k)), b = a + 1, f = k - a;
      return { s: lerp(S[a].s, S[b].s, f), y: lerp(S[a].y, S[b].y, f), dim: lerp(S[a].dim, S[b].dim, f) };
    }
    function draw() {
      const vh = window.innerHeight / sc;
      cards.forEach((c, i) => {
        const face = c.firstElementChild as HTMLElement;
        const f = clamp((cur - i) / FLIP);
        if (i < 2 && f > 0) {
          // forward flip: up and toward the viewer, the bottom edge swinging out of the page
          const e = ease(f), fwd = easeOut(f);
          const z = fwd * 520, ty = -e * vh * 0.62, rx = -e * 62;
          c.style.transform = `translate3d(0,${ty.toFixed(2)}px,${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg)`;
          c.style.opacity = (1 - ease(clamp((f - 0.55) / 0.4))).toFixed(3);
          c.style.visibility = f >= 0.999 ? 'hidden' : 'visible';
          face.style.setProperty('--dim', '0');
        } else {
          // waits in its slot, then comes forward into the front as the page above lifts away
          const n = Math.min(2, Math.floor(cur)), fr = n < 2 ? clamp((cur - n) / FLIP) : 0;
          const step = ease(clamp((fr - 0.08) / 0.62)); // full size well before the old card has gone
          const sl = slot(clamp(i - n - step, 0, 2));
          c.style.transform = `translate3d(0,${sl.y.toFixed(2)}px,0) scale(${sl.s.toFixed(4)})`;
          c.style.opacity = '1';
          c.style.visibility = 'visible';
          face.style.setProperty('--dim', sl.dim.toFixed(3));
        }
      });
    }
    function tick() {
      raf = 0;
      const d = target - cur;
      if (Math.abs(d) < 0.0008 || reduce) { cur = target; draw(); return; }
      cur += d * 0.14;
      draw();
      raf = requestAnimationFrame(tick);
    }
    function onScroll() {
      if (!inView) return;
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    const onResize = () => { fit(); measure(); draw(); };
    kick.current = onScroll;

    const io = new IntersectionObserver((es) => es.forEach((e) => { inView = e.isIntersecting; if (inView) onScroll(); }), { threshold: [0, 0.04, 0.2] });
    io.observe(sw);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onFontsReady(() => { fit(); draw(); });
    fit();
    draw();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef, readyRef]);

  useEffect(() => {
    if (ready) kick.current();
  }, [ready]);
}
