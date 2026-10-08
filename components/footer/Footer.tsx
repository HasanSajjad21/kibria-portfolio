'use client';

import { useRef } from 'react';
import { copyright } from '@/data/site';
import { prefersReducedMotion } from '@/lib/motion';
import { useEntrance } from '@/hooks/useEntrance';
import { SocialLinks } from './SocialLinks';
import './footer.css';

/** Footer: social links, copyright, back-to-top. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { phase } = useEntrance(ref, { minRatio: 0.2 });

  return (
    <footer className={`ft ${phase}`.trim()} id="site-footer" aria-label="Footer" ref={ref}>
      <SocialLinks />
      <p className="ft-copy">{copyright}</p>
      <button
        type="button"
        className="ft-top"
        aria-label="Back to top"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
          document.querySelector<HTMLElement>('#rail [aria-label="Hero"]')?.focus({ preventScroll: true });
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
        </svg>
      </button>
    </footer>
  );
}
