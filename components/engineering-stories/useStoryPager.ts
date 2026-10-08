'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';
import { clamp, easeInOut as ease, onFontsReady, prefersReducedMotion } from '@/lib/motion';
import { useLatest } from '@/hooks/useLatest';

const FLIP = 0.7; // share of each step spent swapping; the rest is a rest

/**
 * One card at a time. The track is tall and its view is pinned; scroll progress picks the card:
 * the current card lifts up and fades out while the next one rises into place, then it rests
 * at full size before the next swap. Scrolling back reverses it.
 * Also keeps the section glow 232px above the header, wherever the pinned layout puts it.
 */
export function useStoryPager(sectionRef: RefObject<HTMLElement | null>, count: number, ready: boolean) {
  const [active, setActive] = useState(0);
  const readyRef = useLatest(ready);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const es = sectionRef.current;
    if (!es) return;
    const reduce = prefersReducedMotion();
    const track = es.querySelector<HTMLElement>('.es-track')!;
    const head = es.querySelector<HTMLElement>('.es-head')!;
    const cards = [...es.querySelectorAll<HTMLElement>('.es-card')];
    let target = 0, cur = 0, raf = 0, inView = false, current = -1;

    function measure() {
      if (!readyRef.current) { target = 0; return; }
      const r = track.getBoundingClientRect(), run = r.height - window.innerHeight;
      const raw = clamp(-r.top / Math.max(1, run));
      target = clamp((raw - 0.05) / 0.88) * (count - 1);
    }
    function set(c: HTMLElement, ty: number, s: number, o: number) {
      c.style.transform = `translate3d(0,${ty.toFixed(2)}px,0) scale(${s.toFixed(4)})`;
      c.style.opacity = o.toFixed(3);
      c.style.visibility = o < 0.002 ? 'hidden' : 'visible';
    }
    function draw() {
      const n = Math.min(count - 1, Math.floor(cur)), f = n < count - 1 ? ease(clamp((cur - n) / FLIP)) : 0;
      cards.forEach((c, i) => {
        if (i === n) set(c, -80 * f, 1 - 0.05 * f, 1 - ease(clamp(f / 0.8)));
        else if (i === n + 1) set(c, (1 - f) * 120, 0.955 + 0.045 * f, ease(clamp((f - 0.12) / 0.88)));
        else set(c, i < n ? -80 : 120, 0.95, 0);
      });
      const a = f > 0.5 ? n + 1 : n;
      if (a !== current) { current = a; setActive(a); }
    }
    function tick() {
      raf = 0;
      const d = target - cur;
      if (Math.abs(d) < 0.001 || reduce) { cur = target; draw(); return; }
      cur += d * 0.14;
      draw();
      raf = requestAnimationFrame(tick);
    }
    function onScroll() {
      if (!inView) return;
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    const placeGlow = () => es.style.setProperty('--gh', head.offsetTop + 'px');
    const onResize = () => { measure(); draw(); placeGlow(); };
    kick.current = onScroll;

    const io = new IntersectionObserver((entries) => entries.forEach((e) => { inView = e.isIntersecting; if (inView) onScroll(); }), { threshold: [0, 0.04, 0.2] });
    io.observe(es);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onFontsReady(placeGlow);
    draw();
    placeGlow();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef, count, readyRef]);

  useEffect(() => {
    if (ready) kick.current();
  }, [ready]);

  return active;
}
