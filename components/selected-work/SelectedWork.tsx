'use client';

import { useRef } from 'react';
import { work } from '@/data/work';
import { useEntrance } from '@/hooks/useEntrance';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { WorkCard } from './WorkCard';
import { useCardStack } from './useCardStack';
import './selected-work.css';

/** "Products I’ve Taken From Zero To Shipped" — a pinned stack of cards that flip toward you. */
export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const { phase, ready } = useEntrance(sectionRef, { minRatio: 0.04, readyDelay: 1100 });
  useCardStack(sectionRef, ready);

  // DOM order: back card first, so the front card paints on top
  const backToFront = [...work].reverse();

  return (
    <section className={`sw ${phase}`.trim()} id="selected-work" aria-labelledby="sw-title" ref={sectionRef}>
      <div className="sw-track">
        <div className="sw-pin">
          <SectionHeader prefix="sw" eyebrow="Selected Work" title="Products I’ve Taken From Zero To Shipped" titleId="sw-title" />
          <div className="sw-stage">
            <div className="sw-bg b1" aria-hidden="true" />
            <div className="sw-bg b2" aria-hidden="true" />
            <div className="sw-bg b3" aria-hidden="true" />
            <div className="sw-stack">
              {backToFront.map((item, i) => (
                <WorkCard key={item.key} item={item} zIndex={i + 1} priority={i === backToFront.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
