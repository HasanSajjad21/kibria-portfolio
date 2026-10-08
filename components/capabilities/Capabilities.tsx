'use client';

import { useRef } from 'react';
import { capabilities } from '@/data/capabilities';
import { pad2 } from '@/lib/motion';
import { useEntrance } from '@/hooks/useEntrance';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CodeEditor } from './CodeEditor';
import { useCapabilityTrack } from './useCapabilityTrack';
import './capabilities.css';

/** "What I Can Own" — six capabilities as code editors on a pinned horizontal track. */
export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const { phase } = useEntrance(sectionRef, { minRatio: 0.12 });
  const active = useCapabilityTrack(sectionRef, capabilities.length);

  return (
    <section className={`capabilities ${phase}`.trim()} id="capabilities" aria-labelledby="cap-title" ref={sectionRef}>
      <div className="cap-sticky">
        <SectionHeader prefix="cap" eyebrow="Capabilities" title="What I Can Own" titleId="cap-title" />

        <div className="cap-stage">
          <div className="cap-viewport">
            <div className="cap-ambient" aria-hidden="true">
              <div className="grid" />
              <div className="cap-glow g1" />
              <div className="cap-glow g2" />
              <div className="cap-glow g3" />
            </div>
            <div className="cap-frame" />
            <ul className="cap-track" aria-label={`Capabilities, ${capabilities.length} source files`}>
              {capabilities.map((cap, i) => (
                <li key={cap.file}>
                  <CodeEditor cap={cap} index={i} total={capabilities.length} active={i === active} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cap-foot" aria-hidden="true">
          <div className="cap-count">
            <span className="cur">{pad2(active + 1)}</span>
            <span className="sep">/</span>
            <span>{pad2(capabilities.length)}</span>
            <span className="cap-name">{capabilities[active].name}</span>
          </div>
          <div className="cap-bar">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
