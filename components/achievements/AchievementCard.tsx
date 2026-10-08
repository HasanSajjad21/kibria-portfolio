'use client';

import type { CSSProperties } from 'react';
import type { Achievement } from '@/data/achievements';

interface AchievementCardProps {
  item: Achievement;
  index: number;
  open: boolean;
  /** the other card in the middle row is open, so this one narrows */
  shrunk: boolean;
  onOpen: (index: number) => void;
  onClose: (index: number) => void;
  onToggle: (index: number) => void;
}

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * A pill metric that widens to reveal its detail. Mouse: hover opens, leaving closes.
 * Keyboard: focus opens, Enter/Space toggles, Escape closes. Touch: tap toggles.
 */
export function AchievementCard({ item, index, open, shrunk, onOpen, onClose, onToggle }: AchievementCardProps) {
  const label = item.label.join(' ');
  return (
    <article
      className={['ach-card', open && 'open', shrunk && 'shrunk'].filter(Boolean).join(' ')}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      aria-label={`${item.metric}, ${label}. Show details.`}
      style={{ '--sw': `${item.labelWidth}px`, '--dw': `${item.descWidth}px` } as CSSProperties}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse' && finePointer()) onOpen(index); }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && finePointer() && document.activeElement !== e.currentTarget) onClose(index);
      }}
      onFocus={(e) => { if (e.currentTarget.matches(':focus-visible')) onOpen(index); }}
      onBlur={(e) => { if (!e.currentTarget.matches(':hover')) onClose(index); }}
      onClick={(e) => {
        if ((e.nativeEvent as PointerEvent).pointerType === 'mouse' && finePointer()) return;
        onToggle(index);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(index); }
        if (e.key === 'Escape') onClose(index);
      }}
    >
      <div className="ach-in">
        <p className="ach-m">{item.metric}</p>
        <div className="ach-tx">
          <p className="ach-lab">
            {item.label[0]}
            <br />
            {item.label[1]}
          </p>
          <p className="ach-desc">{item.description}</p>
        </div>
      </div>
    </article>
  );
}
