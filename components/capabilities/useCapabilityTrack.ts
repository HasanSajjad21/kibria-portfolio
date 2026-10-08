'use client';

import { type RefObject, useEffect, useState } from 'react';
import { clamp, onFontsReady, prefersReducedMotion } from '@/lib/motion';

const SPEED = 1.15; // px of vertical scroll per px of horizontal travel

/**
 * Pinned horizontal track. The section grows tall enough to scroll the whole row of editors
 * past; vertical scroll is mapped to horizontal travel (eased per frame), a "focus point"
 * glides across the panels to pick the active one, and a gentle magnet settles near panel
 * boundaries. Keyboard focus inside a panel brings that panel into view.
 */
export function useCapabilityTrack(sectionRef: RefObject<HTMLElement | null>, count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = prefersReducedMotion();
    const sticky = section.querySelector<HTMLElement>('.cap-sticky')!;
    const viewport = section.querySelector<HTMLElement>('.cap-viewport')!;
    const frame = section.querySelector<HTMLElement>('.cap-frame')!;
    const track = section.querySelector<HTMLElement>('.cap-track')!;
    const ambient = section.querySelector<HTMLElement>('.cap-ambient');
    const foot = section.querySelector<HTMLElement>('.cap-foot')!;
    const bar = section.querySelector<HTMLElement>('.cap-bar i')!;
    let tx = 0, target = 0, current = -1, raf = 0, lastT = 0;
    let gap = 24, frameLeft = 0, frameW = 0, panelW = 0, step = 0, max = 0, range = 0, start = 0;

    function layout() {
      const vr = viewport.getBoundingClientRect(), fr = frame.getBoundingClientRect();
      const per = parseFloat(getComputedStyle(viewport).getPropertyValue('--per')) || 2;
      gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      frameLeft = fr.left - vr.left;
      frameW = fr.width;
      panelW = (frameW - gap * Math.ceil(per - 1)) / per;
      track.style.setProperty('--panel-w', panelW + 'px');
      step = panelW + gap;
      max = Math.max(0, count * panelW + (count - 1) * gap - frameW);
      range = max * SPEED;
      section!.style.height = sticky.offsetHeight + range + 'px';
      start = section!.getBoundingClientRect().top + window.scrollY;
      onScroll(true);
    }
    const progress = () => (range ? clamp((window.scrollY - start) / range, 0, 1) : 0);
    function onScroll(instant?: boolean) {
      target = progress() * max;
      if (instant === true || reduce) { tx = target; apply(); return; }
      if (!raf) { lastT = 0; raf = requestAnimationFrame(tick); }
    }
    function tick(now: number) {
      const dt = lastT ? Math.min(64, now - lastT) : 16.67;
      lastT = now;
      tx += (target - tx) * (1 - Math.pow(1 - 0.1, dt / 16.67));
      if (Math.abs(target - tx) < 0.05) tx = target;
      apply();
      raf = tx !== target ? requestAnimationFrame(tick) : 0;
    }
    function apply() {
      track.style.transform = `translate3d(${(frameLeft - tx).toFixed(2)}px,0,0)`;
      if (ambient) ambient.style.transform = `translate3d(${(-(max ? (tx / max) * 360 : 0)).toFixed(2)}px,0,0)`;
      const p = max ? tx / max : 0;
      bar.style.transform = `scaleX(${p.toFixed(4)})`;
      foot.classList.toggle('is-moving', p > 0.01);
      // the "focus point" glides from the first slot to the last slot across the journey
      const focus = tx + panelW / 2 + (frameW - panelW) * p;
      let best = 0, bestD = Infinity;
      for (let i = 0; i < count; i++) {
        const d = Math.abs(i * step + panelW / 2 - focus);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best !== current) { current = best; setActive(best); }
    }
    /* gentle magnetic snap: only nudges when already very close to a panel boundary */
    function magnet() {
      if (reduce || !max) return;
      const y = window.scrollY;
      if (y <= start + 2 || y >= start + range - 2) return;
      const t = target;
      let s = Math.min(Math.round(t / step) * step, max);
      if (Math.abs(max - t) < Math.abs(s - t)) s = max;
      const d = Math.abs(s - t);
      if (d > 1 && d < step * 0.16) window.scrollTo({ top: start + (s / max) * range, behavior: 'smooth' });
    }
    function reveal(i: number) {
      let t = target;
      const left = i * step, right = left + panelW;
      if (left < t) t = left;
      else if (right > t + frameW) t = right - frameW;
      t = clamp(t, 0, max);
      const y = start + (max ? (t / max) * range : 0);
      const inside = window.scrollY >= start - 1 && window.scrollY <= start + range + 1;
      if (t !== target || !inside) window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }

    let idle = 0, rt = 0;
    const onWinScroll = () => { onScroll(); window.clearTimeout(idle); idle = window.setTimeout(magnet, 180); };
    const relayout = () => { window.clearTimeout(rt); rt = window.setTimeout(layout, 120); };
    const keepClip = () => { viewport.scrollLeft = 0; }; // never let the clip container scroll
    const onFocusIn = (e: FocusEvent) => {
      const art = (e.target as HTMLElement).closest('.editor');
      const i = [...track.querySelectorAll('.editor')].indexOf(art as Element);
      if (i >= 0) reveal(i);
    };

    window.addEventListener('scroll', onWinScroll, { passive: true });
    window.addEventListener('resize', relayout);
    const ro = new ResizeObserver(relayout);
    ro.observe(sticky);
    viewport.addEventListener('scroll', keepClip);
    viewport.addEventListener('focusin', onFocusIn);
    onFontsReady(layout);
    layout();
    return () => {
      window.removeEventListener('scroll', onWinScroll);
      window.removeEventListener('resize', relayout);
      ro.disconnect();
      viewport.removeEventListener('scroll', keepClip);
      viewport.removeEventListener('focusin', onFocusIn);
      window.clearTimeout(idle);
      window.clearTimeout(rt);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef, count]);

  return active;
}
