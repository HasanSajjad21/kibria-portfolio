'use client';

import { useEffect, useRef, useState } from 'react';
import { contact } from '@/data/site';
import { prefersReducedMotion } from '@/lib/motion';
import { useEntrance } from '@/hooks/useEntrance';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from './ContactForm';
import { TalkPrompt } from './TalkPrompt';
import './contact.css';

/** Keep the section on screen after its height changes. */
function bringIntoView(el: HTMLElement, block: ScrollLogicalPosition) {
  const r = el.getBoundingClientRect();
  if (r.top < 0 || r.bottom > window.innerHeight)
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: r.height > window.innerHeight ? 'start' : block });
}

/**
 * "LET’S TALK" → contact form. Both states live in grid-row wrappers that animate open/closed,
 * so the height change is smooth. "Back" (or Escape) returns to the heading.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { phase } = useEntrance(sectionRef, { minRatio: 0.2 });
  const [open, setOpen] = useState(false);
  const opened = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!open && !opened.current) return; // initial render
    opened.current = true;
    const delay = prefersReducedMotion() ? 0 : open ? 380 : 420;
    const t = window.setTimeout(() => {
      if (open) formRef.current?.querySelector<HTMLInputElement>('#ct-name')?.focus({ preventScroll: true });
      else goRef.current?.focus({ preventScroll: true });
      bringIntoView(section, 'center');
    }, delay);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section
      className={['ct', phase, open && 'open'].filter(Boolean).join(' ')}
      id="contact"
      aria-labelledby="ct-title"
      ref={sectionRef}
    >
      <div className="ct-glow" aria-hidden="true" />

      <div className="ct-sw ct-sw-talk">
        <div className="ct-clip">
          <TalkPrompt heading={contact.heading} expanded={open} onOpen={() => setOpen(true)} buttonRef={goRef} />
        </div>
      </div>

      <div className="ct-sw ct-sw-form">
        <div className="ct-clip">
          <div className="ct-panel" id="ct-panel" inert={!open}>
            <button type="button" className="ct-back" aria-label="Back to Let’s Talk" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11.5 5.5 5 12l6.5 6.5" />
              </svg>
              <span>Back</span>
            </button>
            <SectionHeader prefix="ct" eyebrow={contact.eyebrow} title={contact.title} as="h3" />
            <ContactForm ref={formRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
