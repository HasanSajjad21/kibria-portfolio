'use client';

import { useEffect, useState } from 'react';
import type { SectionId } from '@/data/sections';

/**
 * The section that currently fills most of the screen. At the very bottom of the page the
 * last section wins (the contact block is short, so it would never fill the screen).
 */
export function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRect.height);
        let best = '', bv = 0;
        for (const [id, h] of seen) if (h > bv) { bv = h; best = id; }
        if (best) setActive(best as SectionId);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
    );
    els.forEach((el) => io.observe(el));

    let t = 0;
    const onScroll = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        // after the observer has had its say
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive(ids[ids.length - 1]);
      }, 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [active, setActive] as const;
}
