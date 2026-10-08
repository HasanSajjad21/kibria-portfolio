'use client';

import { type CSSProperties, useEffect, useRef } from 'react';
import { experience } from '@/data/experience';
import { prefersReducedMotion } from '@/lib/motion';
import { useEntrance } from '@/hooks/useEntrance';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ExperienceRow } from './ExperienceRow';
import { useTimeline } from './useTimeline';
import './experience.css';

/** "Where I’ve Built" — a scroll-driven timeline of roles. */
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const { phase, ready } = useEntrance(sectionRef, { minRatio: 0.12, readyDelay: 1300 });
  const active = useTimeline(sectionRef, listRef, ready);

  // a soft pulse on the details of each newly active company (not on the first paint)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (prefersReducedMotion()) return;
    const row = listRef.current?.querySelectorAll<HTMLElement>('.xp-row')[active];
    if (!row) return;
    row.classList.remove('pulse');
    void row.offsetWidth;
    row.classList.add('pulse');
  }, [active]);

  return (
    <section className={`xp ${phase}`.trim()} id="experience" aria-labelledby="xp-title" ref={sectionRef}>
      <div className="xp-orb o1" aria-hidden="true" />
      <div className="xp-orb o2" aria-hidden="true" />
      <SectionHeader prefix="xp" eyebrow="Experience" title="Where I’ve Built" titleId="xp-title" />
      <ol className="xp-list" ref={listRef}>
        <li className="xp-line" aria-hidden="true">
          <span className="xp-track" />
          <span className="xp-fillwrap">
            <span className="xp-fill" />
          </span>
          {experience.map((item, i) => (
            <span
              key={item.company}
              className={['xp-mk', i === 0 && 'first', i === active && 'on'].filter(Boolean).join(' ')}
              style={{ '--i': i } as CSSProperties}
            >
              <i />
            </span>
          ))}
        </li>
        {experience.map((item, i) => (
          <ExperienceRow key={item.company} item={item} index={i} active={i === active} />
        ))}
      </ol>
    </section>
  );
}
