import type { ReactNode } from 'react';

/** Icons for the flow nodes (24×24). Line icons use currentColor strokes; a few are filled marks. */

const line = (children: ReactNode) => (
  <svg className="fn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const filled = (children: ReactNode) => (
  <svg className="fn-ic" viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);

export const flowIcons = {
  box: line(
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>,
  ),
  next: filled(
    <>
      <circle cx="12" cy="12" r="10.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.6 16.4V7.6l7.6 9.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.2 7.6v5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>,
  ),
  zap: filled(
    <>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M12.9 4.6 7.4 13.2h4.1l-.9 6.2 5.6-8.7h-4.2z" fill="#141414" />
    </>,
  ),
  db: line(
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>,
  ),
  clickhouse: filled(
    <>
      {[2.5, 6.9, 11.3, 15.7].map((x) => (
        <rect key={x} x={x} y="3" width="2.4" height="18" rx=".5" fill="currentColor" />
      ))}
      <rect x="20.1" y="9.6" width="2.4" height="4.8" rx=".5" fill="currentColor" />
    </>,
  ),
  users: line(
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>,
  ),
  share: line(
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4" />
      <path d="m15.4 6.5-6.8 4" />
    </>,
  ),
  layers: line(
    <>
      <path d="M12.8 2.2a2 2 0 0 0-1.6 0L2.6 6.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9a1 1 0 0 0 0-1.8Z" />
      <path d="m22 17.6-9.2 4.2a2 2 0 0 1-1.6 0L2 17.6" />
      <path d="m22 12.6-9.2 4.2a2 2 0 0 1-1.6 0L2 12.6" />
    </>,
  ),
  leaf: line(
    <>
      <path d="M12 2c3 3 5 6.5 5 10.5S14.8 20 12 22c-2.8-2-5-5.5-5-9.5S9 5 12 2z" />
      <path d="M12 22V8" />
    </>,
  ),
  msg: line(
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8M8 13h5" />
    </>,
  ),
  brain: line(
    <>
      <path d="M12 5a3 3 0 1 0-6 .1 4 4 0 0 0-2.5 5.8 4 4 0 0 0 .6 6.6A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 6 .1 4 4 0 0 1 2.5 5.8 4 4 0 0 1-.6 6.6A4 4 0 1 1 12 18Z" />
      <path d="M12 5v13" />
    </>,
  ),
  file: line(
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </>,
  ),
  shield: line(
    <>
      <path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>,
  ),
  gear: line(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>,
  ),
  chart: line(
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 16v-3M12 16V8M16 16v-5" />
    </>,
  ),
  user: line(
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>,
  ),
  target: line(
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>,
  ),
  filedown: line(
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h6" />
      <path d="M12 11v6" />
      <path d="m9 14 3 3 3-3" />
    </>,
  ),
  elastic: line(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M5 8.5h14M3.5 12H17M5 15.5h14" />
    </>,
  ),
  api: line(
    <>
      <rect x="2.5" y="3" width="19" height="18" rx="2.5" />
      <path d="M2.5 7.5h19" />
      <path d="M5 5.2h.01M7.5 5.2h.01" />
      <text x="12" y="17.6" textAnchor="middle" fontSize="7.2" fontWeight="700" fontFamily="Inter,system-ui,sans-serif" fill="currentColor" stroke="none">
        API
      </text>
    </>,
  ),
} satisfies Record<string, ReactNode>;

export type FlowIconName = keyof typeof flowIcons;
