'use client';

import { type RefObject, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type EntrancePhase = '' | 'pre' | 'in';

interface Options {
  /** share of the element that must be visible before the entrance plays */
  minRatio?: number;
  /** ms after the entrance starts before `ready` flips (lets scroll effects wait for it) */
  readyDelay?: number;
}

/**
 * The entrance used by every section: the content is hidden (`pre`) only once we know the
 * animation can play, then `in` is applied the first time the element scrolls into view.
 * With reduced motion nothing is hidden and `ready` is true straight away.
 *
 * Returns the class to put on the section and whether scroll-driven effects may start.
 */
export function useEntrance(ref: RefObject<Element | null>, { minRatio = 0.15, readyDelay = 0 }: Options = {}) {
  const [phase, setPhase] = useState<EntrancePhase>('');
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }
    setPhase('pre');
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= minRatio) {
            setPhase('in');
            io.disconnect();
            timer = window.setTimeout(() => setReady(true), readyDelay);
          }
        }
      },
      { threshold: [0, minRatio, 0.3] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [ref, minRatio, readyDelay]);

  return { phase, ready };
}
