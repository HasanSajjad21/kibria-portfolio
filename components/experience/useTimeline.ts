'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';
import { onFontsReady, prefersReducedMotion } from '@/lib/motion';
import { useLatest } from '@/hooks/useLatest';

/**
 * Scroll-driven timeline. After the entrance (`ready`) the cyan line's tip follows a reading
 * line at 55% of the viewport, eased per frame; the company whose marker the tip has reached
 * is the active one. Marker positions come from the rows in the DOM, so this holds at any width.
 */
export function useTimeline(sectionRef: RefObject<HTMLElement | null>, listRef: RefObject<HTMLOListElement | null>, ready: boolean) {
  const [active, setActive] = useState(0);
  const readyRef = useLatest(ready);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const xp = sectionRef.current, list = listRef.current;
    if (!xp || !list) return;
    const reduce = prefersReducedMotion();
    const rows = [...list.querySelectorAll<HTMLElement>('.xp-row')];
    const marks = [...list.querySelectorAll<HTMLElement>('.xp-mk')];
    const track = list.querySelector<HTMLElement>('.xp-track')!;
    const wrap = list.querySelector<HTMLElement>('.xp-fillwrap')!;
    const fill = list.querySelector<HTMLElement>('.xp-fill')!;
    let ys: number[] = [], span = 0, tip = 0, target = 0, current = -1, raf = 0, inView = false;

    function layout() {
      const lr = list!.getBoundingClientRect();
      ys = rows.map((r) => {
        const b = r.querySelector('.xp-date')!.getBoundingClientRect();
        return b.top - lr.top + Math.min(16, b.height / 2);
      });
      marks.forEach((m, i) => { m.style.top = ys[i] + 'px'; });
      const top = ys[0] - 4, bot = ys[ys.length - 1] + 23;
      track.style.top = top + 'px';
      track.style.height = bot - top + 'px';
      span = ys[ys.length - 1] - ys[0];
      wrap.style.top = ys[0] + 'px';
      wrap.style.height = span + 3 + 'px';
      measure();
      draw(true);
    }
    function measure() {
      if (!readyRef.current) { target = 0; return; }
      // starts when the first marker crosses the reading line and reaches the last marker when the
      // section's end arrives (or the page can't scroll further), linear in between
      const lr = list!.getBoundingClientRect(), read = window.innerHeight * 0.55;
      const now = read - (lr.top + ys[0]);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const left = Math.max(0, Math.min(xp!.getBoundingClientRect().bottom - window.innerHeight, maxScroll - window.scrollY));
      const D = Math.max(1, now + left);
      target = span * Math.max(0, Math.min(1, now / D));
    }
    function draw(snap = false) {
      if (snap || reduce) tip = target;
      const h = span + 3, p = span ? (tip + 3) / h : 1;
      fill.style.transform = `translate3d(0,${(-(1 - Math.min(1, p)) * 100).toFixed(3)}%,0)`;
      let k = 0;
      for (let i = 0; i < ys.length; i++) if (ys[i] - ys[0] <= tip + 0.5) k = i;
      if (k !== current) { current = k; setActive(k); }
    }
    function tick() {
      raf = 0;
      const d = target - tip;
      if (Math.abs(d) < 0.3) { tip = target; draw(); return; }
      tip += d * 0.16;
      draw();
      raf = requestAnimationFrame(tick);
    }
    function onScroll() {
      if (!inView) return;
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    kick.current = () => { inView = true; onScroll(); };

    const io = new IntersectionObserver((es) => es.forEach((e) => { inView = e.isIntersecting; if (inView) onScroll(); }), { threshold: [0, 0.12, 0.3] });
    io.observe(xp);
    const ro = new ResizeObserver(() => layout());
    ro.observe(list);
    window.addEventListener('scroll', onScroll, { passive: true });
    onFontsReady(layout);
    layout();
    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef, listRef, readyRef]);

  // once the entrance has played, let scroll take over
  useEffect(() => {
    if (ready) kick.current();
  }, [ready]);

  return active;
}
