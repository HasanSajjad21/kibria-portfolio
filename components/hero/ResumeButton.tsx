'use client';

import { useEffect, useRef } from 'react';
import { ArrowBadge } from '@/components/ui/ArrowBadge';

interface ResumeButtonProps {
  label: string;
  href: string;
}

/**
 * Pill CTA whose outline draws itself in. The SVG rect is sized to the pill (and its
 * perimeter exposed as --len) whenever the pill changes size.
 */
export function ResumeButton({ label, href }: ResumeButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const cta = ref.current, rect = rectRef.current;
    if (!cta || !rect) return;
    const size = () => {
      const w = cta.offsetWidth, h = cta.offsetHeight, r = h / 2;
      rect.setAttribute('width', String(Math.max(0, w - 1.5)));
      rect.setAttribute('height', String(Math.max(0, h - 1.5)));
      rect.setAttribute('rx', String(r));
      rect.setAttribute('ry', String(r));
      cta.style.setProperty('--len', (2 * (w - h) + Math.PI * h).toFixed(1));
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cta);
    return () => ro.disconnect();
  }, []);

  return (
    <a
      className="hero-cta"
      href={href}
      ref={ref}
      onClick={(e) => {
        if (href === '#') e.preventDefault(); // no resume linked yet
      }}
    >
      <svg className="border" aria-hidden="true">
        <rect ref={rectRef} x=".75" y=".75" rx="0" ry="0" />
      </svg>
      <span>{label}</span>
      <span className="arrow" aria-hidden="true">
        <ArrowBadge />
      </span>
    </a>
  );
}
