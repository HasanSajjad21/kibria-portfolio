/** Small, honest tokenizers — one per file type shown in the Capabilities editors. */

import type { CapLang } from '@/data/capabilities';

export type TokenClass =
  | 'ws' | 'com' | 'str' | 'num' | 'bool' | 'self' | 'kw' | 'fn' | 'type' | 'var' | 'prop' | 'id' | 'op' | 'punc'
  | 'doc' | 'md-mark' | 'md-h' | 'md-text';

export interface Token {
  c: TokenClass;
  t: string;
}

interface LangSpec {
  unit: number;
  re?: RegExp;
  kw?: Set<string>;
  bool?: Set<string>;
  fns?: Set<string>;
  self?: string;
  props?: boolean;
  ci?: boolean;
  typeAfter?: Set<string>;
  fnAfter?: Set<string>;
  varAfter?: Set<string>;
}

const set = (s: string) => new Set(s.split(/\s+/).filter(Boolean));
const C_LIKE = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(=>|===|!==|==|::|->|&&|\|\||[=+*\/<>!&|%?-])|([{}\[\]();,.:])/g;

export const LANGS: Record<CapLang, LangSpec> = {
  py: {
    unit: 4,
    re: /(#.*$)|("""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(==|!=|<=|>=|->|[=+*\/<>%-])|([{}\[\]();,.:@])/g,
    kw: set('class def return if elif else for in while import from as with try except pass lambda yield async await and or not is'),
    bool: set('True False None'),
    self: 'self',
    typeAfter: set('class'), fnAfter: set('def'), varAfter: set(''),
  },
  ts: {
    unit: 2, re: C_LIKE, props: true,
    kw: set('const let var interface type return export import from new function async await class extends implements readonly'),
    bool: set('true false null undefined'),
    typeAfter: set('interface type class extends implements'), fnAfter: set('function'), varAfter: set('const let var'),
  },
  js: {
    unit: 2, re: C_LIKE, props: true,
    kw: set('const let var return export import from new function async await class extends'),
    bool: set('true false null undefined'),
    typeAfter: set('class extends'), fnAfter: set('function'), varAfter: set('const let var'),
  },
  sql: {
    unit: 2, ci: true,
    re: /(--.*$)|('(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(<>|<=|>=|[=+*\/<>-])|([();,.])/g,
    kw: set('SELECT FROM WHERE GROUP BY ORDER AS AND OR ON JOIN LEFT RIGHT INNER LIMIT HAVING DISTINCT INSERT INTO VALUES UPDATE SET DESC ASC'),
    fns: set('COUNT AVG SUM MIN MAX'), bool: set('NULL TRUE FALSE'),
    typeAfter: set(''), fnAfter: set(''), varAfter: set(''),
  },
  cpp: {
    unit: 4, re: C_LIKE,
    kw: set('class struct public private protected void auto return const int bool char double float using namespace include new delete'),
    bool: set('true false nullptr'),
    typeAfter: set('class struct'), fnAfter: set(''), varAfter: set(''),
  },
  md: { unit: 2 },
};

export function tokenizeMD(text: string): Token[] {
  if (!text) return [];
  let m: RegExpMatchArray | null;
  if ((m = text.match(/^(#{1,6})(\s+)(.*)$/))) return [{ c: 'md-mark', t: m[1] }, { c: 'ws', t: m[2] }, { c: 'md-h', t: m[3] }];
  if ((m = text.match(/^([-*])(\s+)(.*)$/))) return [{ c: 'md-mark', t: m[1] }, { c: 'ws', t: m[2] }, { c: 'md-text', t: m[3] }];
  return [{ c: 'md-text', t: text }];
}

export function tokenize(lang: CapLang, text: string): Token[] {
  if (lang === 'md') return tokenizeMD(text);
  const L = LANGS[lang], re = new RegExp(L.re!.source, L.re!.flags);
  const out: Token[] = [];
  let last = 0, prev: string | null = null, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ c: 'ws', t: text.slice(last, m.index) });
    const [tok, com, str, num, word, op] = m;
    let c: TokenClass;
    if (com) c = 'com';
    else if (str) c = 'str';
    else if (num) c = 'num';
    else if (word) {
      const w = L.ci ? word.toUpperCase() : word;
      const next = (text.slice(re.lastIndex).match(/^\s*(\S)/) || [])[1];
      if (L.bool!.has(w)) c = 'bool';
      else if (L.self && word === L.self) c = 'self';
      else if (L.kw!.has(w)) c = 'kw';
      else if (L.fns && L.fns.has(w)) c = 'fn';
      else if (prev && L.typeAfter!.has(prev)) c = 'type';
      else if (prev && L.fnAfter!.has(prev)) c = 'fn';
      else if (prev && L.varAfter!.has(prev)) c = 'var';
      else if (next === '(') c = 'fn';
      else if (L.props && next === ':') c = 'prop';
      else if (!L.ci && /^[A-Z]/.test(word)) c = 'type';
      else c = 'id';
      prev = w;
    } else {
      c = op ? 'op' : 'punc';
      prev = null;
    }
    out.push({ c, t: tok });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ c: 'ws', t: text.slice(last) });
  return out;
}
