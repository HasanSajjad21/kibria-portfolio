'use client';

import { type CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { achievements } from '@/data/achievements';
import { useEntrance } from '@/hooks/useEntrance';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AchievementCard } from './AchievementCard';
import './achievements.css';

const LAYOUT_W = 1008; // the Figma layout area, scaled down on tablets

/**
 * "A Competitive Foundation" — four pill metrics; one opens at a time. The middle pair shares
 * a flex row (484/484 → 650/318 → 318/650) so it always totals 1008px and stays centred.
 */
export function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const { phase } = useEntrance(sectionRef, { minRatio: 0.15 });
  const [open, setOpen] = useState(-1);
  const [k, setK] = useState(1);

  const openCard = useCallback((i: number) => setOpen(i), []);
  const closeCard = useCallback((i: number) => setOpen((cur) => (cur === i ? -1 : cur)), []);
  const toggleCard = useCallback((i: number) => setOpen((cur) => (cur === i ? -1 : i)), []);

  // scale the fixed 1008px layout down on narrower screens (phones use their own stacked layout)
  useEffect(() => {
    const scale = () => {
      const s = sectionRef.current;
      if (!s) return;
      const w = s.clientWidth - (window.innerWidth > 1100 ? 240 : 136);
      setK(window.innerWidth <= 760 ? 1 : Math.min(1, w / LAYOUT_W));
    };
    scale();
    window.addEventListener('resize', scale);
    return () => window.removeEventListener('resize', scale);
  }, []);

  const card = (i: number) => (
    <AchievementCard
      key={i}
      item={achievements[i]}
      index={i}
      open={open === i}
      shrunk={(open === 1 && i === 2) || (open === 2 && i === 1)}
      onOpen={openCard}
      onClose={closeCard}
      onToggle={toggleCard}
    />
  );
  const middle = ['ach-row r2', open === 1 && 'l', open === 2 && 'r'].filter(Boolean).join(' ');

  return (
    <section className={`ach ${phase}`.trim()} id="achievements" aria-labelledby="ach-title" ref={sectionRef}>
      <SectionHeader prefix="ach" eyebrow="Achievements" title="A Competitive Foundation" titleId="ach-title" />
      <div className="ach-fit" style={{ '--k': k.toFixed(4) } as CSSProperties}>
        <div className="ach-stage">
          <div className="ach-row r1">{card(0)}</div>
          <div className={middle}>
            {card(1)}
            {card(2)}
          </div>
          <div className="ach-row r3">{card(3)}</div>
        </div>
      </div>
    </section>
  );
}
