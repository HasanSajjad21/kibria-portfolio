'use client';

import { useEffect, useRef, useState } from 'react';

/** Copy text to the clipboard and expose a short-lived "Copied" state. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const [label, setLabel] = useState('');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* nothing else to try */ }
      ta.remove();
    }
    timers.current.forEach((t) => window.clearTimeout(t));
    setLabel('Copied');
    setCopied(true);
    timers.current = [
      window.setTimeout(() => setCopied(false), 1400),
      window.setTimeout(() => setLabel(''), 1700),
    ];
  }

  return { copied, label, copy };
}
