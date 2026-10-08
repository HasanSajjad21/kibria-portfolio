'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { hero } from '@/data/site';
import { prefersReducedMotion } from '@/lib/motion';
import { useReplay } from '@/components/providers/ReplayProvider';
import { createRibbon, type RibbonHandle } from './ribbon-engine';

const LAYERS_BEHIND = ['rb-halo', 'rb-back', 'rb-backText'];
const LAYERS_FRONT = ['rb-shadow', 'rb-front', 'rb-frontText'];

/** The portrait with the 3D ribbon wrapped around it (canvas layers behind and in front). */
export function Portrait() {
  const figRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const ribbon = useRef<RibbonHandle | null>(null);
  const { replayCount } = useReplay();

  useEffect(() => {
    const fig = figRef.current, img = imgRef.current;
    if (!fig || !img) return;
    // the lettering uses the page's Inter (next/font exposes the generated family as a CSS var)
    const inter = getComputedStyle(document.documentElement).getPropertyValue('--font-inter').trim();
    ribbon.current = createRibbon(fig, img, {
      fontFamily: `${inter ? inter + ', ' : ''}Inter, system-ui, -apple-system, "Segoe UI", sans-serif`,
      reducedMotion: prefersReducedMotion(),
    });
    return () => {
      ribbon.current?.destroy();
      ribbon.current = null;
    };
  }, []);

  useEffect(() => {
    if (replayCount) ribbon.current?.replay();
  }, [replayCount]);

  return (
    <div className="hero-portrait" ref={figRef}>
      {LAYERS_BEHIND.map((c) => (
        <canvas key={c} className={c} aria-hidden="true" />
      ))}
      <Image
        ref={imgRef}
        src={hero.portrait.src}
        width={hero.portrait.width}
        height={hero.portrait.height}
        alt={hero.portrait.alt}
        sizes="(max-width: 760px) 100vw, 53vw"
        priority
      />
      {LAYERS_FRONT.map((c) => (
        <canvas key={c} className={c} aria-hidden="true" />
      ))}
      <p className="sr-only">{hero.ribbonText}</p>
    </div>
  );
}
