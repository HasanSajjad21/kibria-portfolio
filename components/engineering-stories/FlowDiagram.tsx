'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FlowSpec } from '@/data/stories';
import { onFontsReady } from '@/lib/motion';
import { boxOf, route } from './connectors';
import { FlowNode } from './FlowNode';

interface Lines { w: number; h: number; paths: string[] }

/**
 * A flow diagram made of real HTML nodes (Figma 933:23 style, brand cyan). Nodes are laid out
 * at their natural size by CSS grid, connectors are routed from their real positions, then the
 * whole diagram is scaled to fit its column (on phones it scrolls sideways below 78%).
 */
export function FlowDiagram({ flow }: { flow: FlowSpec }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const flRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Lines | null>(null);
  const markerId = `fla-${useId().replace(/:/g, '')}`;

  // route the connectors once the nodes have their final size (after fonts load)
  useEffect(() => {
    const fl = flRef.current;
    if (!fl) return;
    const measure = () => {
      const node = (k: string) => fl.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
      setLines({
        w: fl.offsetWidth,
        h: fl.offsetHeight,
        paths: flow.edges.map((e) => route(boxOf(node(e.from)), boxOf(node(e.to)), e.kind)),
      });
    };
    measure();
    onFontsReady(measure);
  }, [flow]);

  // scale the natural-size diagram to its column
  useEffect(() => {
    const wrap = wrapRef.current, fl = flRef.current;
    if (!wrap || !fl) return;
    const fit = () => {
      const W = fl.offsetWidth, H = fl.offsetHeight, phone = window.innerWidth <= 760;
      const avail = (wrap.parentElement?.clientWidth ?? W) - (phone ? 40 : 0);
      const k = Math.min(1, Math.max(phone ? 0.78 : 0, avail / W));
      fl.style.setProperty('--fk', k.toFixed(4));
      wrap.style.setProperty('--fh', (H * k).toFixed(1) + 'px');
      wrap.style.width = phone && W * k > avail ? (W * k).toFixed(1) + 'px' : '';
    };
    fit();
    onFontsReady(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div className="fl-wrap" ref={wrapRef}>
      <div className={`fl fl-${flow.layout}`} role="img" aria-label={flow.label} ref={flRef}>
        <svg className="fl-lines" aria-hidden="true" width={lines?.w} height={lines?.h}>
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M1 1.5 8 5 1 8.5" fill="none" stroke="#1DF9D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {lines?.paths.map((d, i) => (
            <g key={i}>
              <path className="ed" d={d} markerEnd={`url(#${markerId})`} />
              <path className="ed-flow" d={d} />
            </g>
          ))}
        </svg>
        {flow.nodes.map((n) => (
          <FlowNode key={n.key} node={n} />
        ))}
      </div>
    </div>
  );
}
