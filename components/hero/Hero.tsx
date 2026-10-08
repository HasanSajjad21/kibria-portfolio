'use client';

import { useEffect, useRef } from 'react';
import { hero, site } from '@/data/site';
import { onFontsReady } from '@/lib/motion';
import { useRestartOnReplay } from '@/components/providers/ReplayProvider';
import { Portrait } from './Portrait';
import { ResumeButton } from './ResumeButton';
import './hero.css';

/**
 * Hero. Laid out on a fixed-ratio canvas (2576×1256 design) in container units, so it scales
 * like the comp; it stacks on phones. The entrance is pure CSS (the `play` class).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useRestartOnReplay(() => sectionRef.current);

  // fit display type to the comp: widest headline line = 33cqw, name = 14.3cqw (phone: fill width)
  useEffect(() => {
    const section = sectionRef.current, head = headRef.current, name = nameRef.current;
    if (!section || !head || !name) return;
    const fit = () => {
      const W = section.clientWidth, phone = W <= 760;
      head.style.setProperty('--hs', '100px');
      name.style.setProperty('--ns', '100px');
      const widest = Math.max(...[...head.querySelectorAll<HTMLElement>('.row > span')].map((e) => e.scrollWidth));
      const tH = phone ? W - 32 : W * 0.33;
      head.style.setProperty('--hs', ((100 * tH) / widest).toFixed(2) + 'px');
      const nW = name.querySelector('span')!.scrollWidth;
      const tN = phone ? Math.min(W - 32, 340) : W * 0.143;
      name.style.setProperty('--ns', ((100 * tN) / nW).toFixed(2) + 'px');
    };
    fit();
    window.addEventListener('resize', fit);
    onFontsReady(fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <section className="hero play" id="hero" aria-label="Introduction" ref={sectionRef}>
      <div className="hero-bg" />
      <div className="hero-glow" />

      <Portrait />
      <div className="hero-fade" aria-hidden="true" />

      <p className="hero-eyebrow">{hero.eyebrow}</p>
      <h1 className="hero-headline" ref={headRef}>
        {hero.headline.map((line) => (
          <span className="row" key={line.text}>
            <span className={line.accent ? 'accent' : undefined}>{line.text}</span>
          </span>
        ))}
      </h1>

      <ResumeButton label={hero.cta.label} href={hero.cta.href} />

      <div className="hero-info">
        <h2 ref={nameRef}>
          <span>{site.name}</span>
        </h2>
        <p className="role">{hero.role}</p>
        <div className="rule" />
        <ul>
          {hero.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
