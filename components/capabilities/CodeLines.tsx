import { memo } from 'react';
import { pad2 } from '@/lib/motion';
import { type CodeLine, indentLevels } from './code/buildCode';

interface CodeLinesProps {
  lines: CodeLine[];
  unit: number;
  caret: number;
  hot: number;
}

/** The numbered, syntax-coloured lines of one editor, with indent guides and the caret. */
export const CodeLines = memo(function CodeLines({ lines, unit, caret, hot }: CodeLinesProps) {
  const levels = indentLevels(lines, unit);
  return (
    <div className="ed-lines">
      {lines.map((l, i) => {
        const lv = Math.min(levels[i], Math.floor(l.ind / unit) || (l.parts.length ? 0 : levels[i]));
        const pad = l.parts.length ? ' '.repeat(Math.max(0, l.ind - lv * unit)) : '';
        const cls = ['ln', i === caret && 'is-cursor', i === hot && 'is-hot'].filter(Boolean).join(' ');
        return (
          <div className={cls} data-i={i} key={i}>
            <span className="gut" aria-hidden="true">
              {pad2(i + 1)}
            </span>
            <span className="code">
              {Array.from({ length: lv }, (_, g) => (
                <span key={g} className="ig" style={{ width: `${unit}ch` }} />
              ))}
              {pad}
              {l.parts.map((t, k) =>
                t.c === 'ws' ? t.t : (
                  <span key={k} className={`tk t-${t.c}`}>
                    {t.t}
                  </span>
                ),
              )}
              {i === caret && <span className="caret" aria-hidden="true" />}
            </span>
          </div>
        );
      })}
    </div>
  );
});
