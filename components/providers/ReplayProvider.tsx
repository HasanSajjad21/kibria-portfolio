'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ReplayContextValue {
  /** increments every time the visitor asks to replay the hero entrance */
  replayCount: number;
  replay: () => void;
}

const ReplayContext = createContext<ReplayContextValue>({ replayCount: 0, replay: () => {} });

export function ReplayProvider({ children }: { children: ReactNode }) {
  const [replayCount, setReplayCount] = useState(0);
  const replay = useCallback(() => setReplayCount((n) => n + 1), []);
  const value = useMemo(() => ({ replayCount, replay }), [replayCount, replay]);
  return <ReplayContext.Provider value={value}>{children}</ReplayContext.Provider>;
}

export const useReplay = () => useContext(ReplayContext);

/**
 * Restarts CSS keyframes on `el` whenever a replay is requested: drop the class, force a
 * reflow, add it back.
 */
export function useRestartOnReplay(el: () => HTMLElement | null, className = 'play') {
  const { replayCount } = useReplay();
  useEffect(() => {
    if (!replayCount) return;
    const node = el();
    if (!node) return;
    node.classList.remove(className);
    void node.offsetWidth;
    node.classList.add(className);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayCount]);
}
