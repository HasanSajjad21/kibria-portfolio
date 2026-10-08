'use client';

import { type KeyboardEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { Capability } from '@/data/capabilities';
import { clamp, pad2 } from '@/lib/motion';
import { buildCode, langUnit, lastFilledLine } from './code/buildCode';
import { CodeLines } from './CodeLines';
import { CheckIcon, CopyIcon, SplitIcon } from './editor-icons';
import { useCopy } from './useCopy';

interface CodeEditorProps {
  cap: Capability;
  index: number;
  total: number;
  active: boolean;
}

/**
 * One capability as a glassy code editor. The description is re-wrapped to the panel width;
 * lines can be explored with the pointer or the keyboard (arrows / PageUp / PageDown / Home /
 * End, Enter places the caret) and the status bar follows. The file can be copied.
 */
export function CodeEditor({ cap, index, total, active }: CodeEditorProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(52);
  const lines = useMemo(() => buildCode(cap, cols), [cap, cols]);
  const [caret, setCaret] = useState(() => lastFilledLine(lines));
  const [hot, setHot] = useState(-1);
  const [hasMore, setHasMore] = useState(false);
  const pointerInside = useRef(false);
  const { copied, label: copiedLabel, copy } = useCopy();
  const unit = langUnit(cap.lang);
  const num = pad2(index + 1);

  // re-wrap the description whenever the panel width changes (and reset to the resting state)
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let pending = 0;
    const measure = () => {
      pending = 0;
      const w = body.clientWidth;
      if (!w) return;
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
      probe.textContent = 'M'.repeat(40);
      body.appendChild(probe);
      const ch = probe.getBoundingClientRect().width / 40 || 7.8;
      probe.remove();
      const gut = body.querySelector<HTMLElement>('.gut')?.offsetWidth || 52;
      setCols(clamp(Math.floor((w - gut - 26) / ch), 24, 70));
    };
    const ro = new ResizeObserver(() => { if (!pending) pending = requestAnimationFrame(measure); });
    ro.observe(body);
    return () => { ro.disconnect(); cancelAnimationFrame(pending); };
  }, []);

  // when the text re-wraps, return to the resting state (caret on the last line, nothing hot)
  const [shownLines, setShownLines] = useState(lines);
  if (shownLines !== lines) {
    setShownLines(lines);
    setCaret(lastFilledLine(lines));
    setHot(-1);
  }
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [lines]);

  // the "more below" fade
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    let raf = 0;
    const sync = () => { raf = 0; setHasMore(body.scrollTop + body.clientHeight < body.scrollHeight - 4); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };
    sync();
    body.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(body);
    return () => { body.removeEventListener('scroll', onScroll); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [lines]);

  const lineAt = (target: EventTarget) => {
    const ln = (target as HTMLElement).closest?.('.ln') as HTMLElement | null;
    return ln ? Number(ln.dataset.i) : -1;
  };

  const ensureVisible = (i: number) => {
    const b = bodyRef.current;
    const el = b?.querySelectorAll<HTMLElement>('.ln')[i];
    if (!b || !el) return;
    const top = el.offsetTop, bot = top + el.offsetHeight;
    if (top < b.scrollTop + 10) b.scrollTop = top - 14;
    else if (bot > b.scrollTop + b.clientHeight - 10) b.scrollTop = bot - b.clientHeight + 14;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = lines.length;
    let i = hot >= 0 ? hot : caret;
    switch (e.key) {
      case 'ArrowDown': i++; break;
      case 'ArrowUp': i--; break;
      case 'PageDown': i += 10; break;
      case 'PageUp': i -= 10; break;
      case 'Home': i = 0; break;
      case 'End': i = n - 1; break;
      case 'Enter': setCaret(i); e.preventDefault(); return;
      case 'Escape': e.currentTarget.blur(); return;
      default: return;
    }
    e.preventDefault();
    i = clamp(i, 0, n - 1);
    ensureVisible(i);
    setHot(i);
  };

  // status bar: the hovered line (or the caret line)
  const shown = hot >= 0 ? hot : caret;
  const text = lines[shown]?.text ?? '';
  const col = shown === caret ? text.length + 1 : (text.match(/^ */)?.[0].length ?? 0) + 1;

  return (
    <article className={`editor${active ? ' is-active' : ''}`} aria-label={`${cap.name} — capability ${num} of ${pad2(total)}`}>
      <div className="ed-toolbar">
        <div className="ed-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <h3 className="ed-title">
          <span className={`ficon lang-${cap.lang}`} aria-hidden="true">{cap.badge}</span>
          <span className="ed-name">{cap.name}</span>
          <span className="ed-ext">{cap.file}</span>
        </h3>
        <div className="ed-actions">
          <span className="ed-act" aria-hidden="true" title="Split editor">
            <SplitIcon />
          </span>
          <button
            className={`ed-act copy${copied ? ' is-copied' : ''}`}
            type="button"
            aria-label="Copy file contents"
            onClick={() => copy(lines.map((l) => l.text).join('\n'))}
          >
            <span className="copied" aria-live="polite">{copiedLabel}</span>
            <span className="ic">{copied ? <CheckIcon /> : <CopyIcon />}</span>
          </button>
        </div>
      </div>
      <div className="ed-crumbs" aria-hidden="true">
        capabilities<span className="sep">›</span>
        {num}
        <span className="sep">›</span>
        <span className="file">{cap.file}</span>
      </div>
      <div className={`ed-main${hasMore ? ' has-more' : ''}`}>
        <div
          className="ed-body"
          ref={bodyRef}
          tabIndex={0}
          aria-label={`${cap.name} source. Use arrow keys to move between lines.`}
          onPointerEnter={() => { pointerInside.current = true; }}
          onPointerMove={(e: PointerEvent) => { const i = lineAt(e.target); if (i >= 0) setHot(i); }}
          onPointerLeave={(e) => {
            pointerInside.current = false;
            setHot(document.activeElement === e.currentTarget ? caret : -1);
          }}
          onClick={(e) => {
            const i = lineAt(e.target);
            if (i < 0 || String(window.getSelection())) return;
            setCaret(i);
          }}
          onFocus={() => { if (hot < 0) setHot(caret); }}
          onBlur={() => { if (!pointerInside.current) setHot(-1); }}
          onKeyDown={onKeyDown}
        >
          <CodeLines lines={lines} unit={unit} caret={caret} hot={hot} />
        </div>
      </div>
      <footer className="ed-status">
        <span className="st-branch">
          <i />
          main
        </span>
        <span className="hide-sm">0 problems</span>
        <span className="st-sp" />
        <span className="st-pos" aria-live="off">
          Ln {shown + 1}, Col {col}
        </span>
        <span className="hide-sm">UTF-8</span>
        <span className="st-lang">{cap.langName}</span>
      </footer>
    </article>
  );
}
