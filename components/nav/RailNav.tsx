'use client';

import { useRef } from 'react';
import { sections } from '@/data/sections';
import { prefersReducedMotion } from '@/lib/motion';
import { useRestartOnReplay } from '@/components/providers/ReplayProvider';
import { railIcons } from './rail-icons';
import { useActiveSection } from './useActiveSection';
import './rail.css';

/**
 * Fixed section rail on the right. Labels show only on hover / keyboard focus; the section
 * in view gets the cyan icon.
 */
export function RailNav() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useActiveSection(sections.map((s) => s.id));
  useRestartOnReplay(() => ref.current);

  return (
    <nav className="rail play" id="rail" aria-label="Sections" ref={ref}>
      {sections.map(({ id, label }) => {
        const on = id === active;
        return (
          <button
            key={id}
            type="button"
            className={on ? 'on' : undefined}
            aria-current={on ? 'true' : undefined}
            aria-label={label}
            onClick={() => {
              document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
              setActive(id);
            }}
          >
            {railIcons[id]}
            <span className="nav-label" aria-hidden="true">
              {label}
              <i />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
