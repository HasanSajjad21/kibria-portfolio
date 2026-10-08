'use client';

import { useEffect, useState } from 'react';
import { useReplay } from '@/components/providers/ReplayProvider';

/** Floating control that replays the hero entrance. Steps aside while the footer is visible. */
export function ReplayButton() {
  const { replay } = useReplay();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => setHidden(e.isIntersecting)));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <button className={hidden ? 'replay ft-hide' : 'replay'} type="button" onClick={replay}>
      Replay entrance
    </button>
  );
}
