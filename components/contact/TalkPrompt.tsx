'use client';

import { type Ref, useRef, useState } from 'react';

interface TalkPromptProps {
  heading: string;
  expanded: boolean;
  onOpen: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * The big "LET’S TALK". Mouse: hovering reveals the circle button. Touch: the first tap
 * reveals it, tapping the button opens the form. Keyboard: Tab reaches the button.
 */
export function TalkPrompt({ heading, expanded, onOpen, buttonRef }: TalkPromptProps) {
  const [shown, setShown] = useState(false);
  const lastPointer = useRef<string>('mouse');
  const isTouch = () => lastPointer.current !== 'mouse' || !finePointer();

  return (
    <div
      className={shown ? 'ct-talk show' : 'ct-talk'}
      onPointerDownCapture={(e) => { lastPointer.current = e.pointerType; }}
      onClick={() => { if (isTouch()) setShown((s) => !s); }}
    >
      <h2 className="ct-big" id="ct-title">
        <span>{heading}</span>
      </h2>
      <button
        type="button"
        className="ct-go"
        ref={buttonRef}
        aria-label="Open the contact form"
        aria-controls="ct-panel"
        aria-expanded={expanded}
        onClick={(e) => {
          e.stopPropagation();
          // touch: the first tap only reveals the button (keyboard clicks have detail 0)
          if (isTouch() && !shown && e.detail !== 0) { setShown(true); return; }
          setShown(false);
          onOpen();
        }}
      >
        <svg className="ct-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5.5 12h12.2M12.6 6.6 18 12l-5.4 5.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        </svg>
      </button>
    </div>
  );
}
