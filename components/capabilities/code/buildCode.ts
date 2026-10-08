/** Turns a capability into editor lines: the code, then the description as that language's comments. */

import type { Capability } from '@/data/capabilities';
import { LANGS, type Token, tokenize, tokenizeMD } from './tokenize';

export interface CodeLine {
  /** leading spaces */
  ind: number;
  parts: Token[];
  /** plain text of the whole line (for copy + the status bar column) */
  text: string;
}

const mkLine = (ind: number, parts: Token[]): CodeLine => ({ ind, parts, text: ' '.repeat(ind) + parts.map((p) => p.t).join('') });
const blank = () => mkLine(0, []);

/** greedy word wrap to `width` characters */
export function wrap(text: string, width: number) {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(/\s+/)) {
    if (line && (line + ' ' + w).length > width) { out.push(line); line = w; }
    else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

function codeLines(lang: Capability['lang'], src: string) {
  return src.split('\n').map((raw) => {
    const ind = (raw.match(/^ */) || [''])[0].length;
    const rest = raw.slice(ind);
    return rest ? mkLine(ind, tokenize(lang, rest)) : blank();
  });
}

const DOC: Record<Capability['lang'], { pre: string; open?: Token[]; close?: Token[] }> = {
  py: { pre: '# ' },
  ts: { open: [{ c: 'com', t: '/**' }], pre: ' * ', close: [{ c: 'com', t: ' */' }] },
  cpp: { open: [{ c: 'com', t: '/*' }], pre: ' * ', close: [{ c: 'com', t: ' */' }] },
  js: { pre: '// ' },
  sql: { pre: '-- ' },
  md: { pre: '' },
};

/** the description, written the way each language writes prose */
function descLines(cap: Capability, cols: number) {
  const doc = DOC[cap.lang];
  const L: CodeLine[] = [];
  if (cap.lang === 'md') L.push(mkLine(0, tokenizeMD('# ' + cap.name)), blank());
  if (doc.open) L.push(mkLine(0, doc.open));
  const cls = cap.lang === 'md' ? 'md-text' : 'doc';
  cap.desc.forEach((para, k) => {
    wrap(para, Math.max(20, cols - doc.pre.length)).forEach((t) =>
      L.push(mkLine(0, (doc.pre ? [{ c: 'com', t: doc.pre } as Token] : []).concat({ c: cls, t }))),
    );
    if (k < cap.desc.length - 1) L.push(doc.pre.trim() ? mkLine(0, [{ c: 'com', t: doc.pre.trimEnd() }]) : blank());
  });
  if (doc.close) L.push(mkLine(0, doc.close));
  return L;
}

/** Markdown reads top-down as a document; code files lead with the code itself. */
export function buildCode(cap: Capability, cols: number): CodeLine[] {
  if (cap.lang === 'md') return descLines(cap, cols).concat(blank(), codeLines('md', cap.code));
  return codeLines(cap.lang, cap.code).concat(blank(), descLines(cap, cols));
}

/** indent-guide depth per line (blank lines take the shallower of their neighbours) */
export function indentLevels(lines: CodeLine[], unit: number) {
  const lead = lines.map((l) => (l.parts.length ? l.ind : -1));
  return lead.map((n, i) => {
    if (n >= 0) return Math.floor(n / unit);
    let p = i - 1, q = i + 1;
    while (p >= 0 && lead[p] < 0) p--;
    while (q < lead.length && lead[q] < 0) q++;
    const a = p >= 0 ? lead[p] : 0, b = q < lead.length ? lead[q] : 0;
    return Math.floor(Math.min(a, b) / unit);
  });
}

export const langUnit = (lang: Capability['lang']) => LANGS[lang].unit;

/** the line the caret rests on: the last non-empty line */
export const lastFilledLine = (lines: CodeLine[]) => {
  let last = lines.length - 1;
  while (last > 0 && !lines[last].text.trim()) last--;
  return last;
};
