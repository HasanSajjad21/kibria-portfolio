const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const SplitIcon = () => (
  <svg {...base} strokeWidth={1.7}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M12 4v16" />
  </svg>
);

export const CopyIcon = () => (
  <svg {...base} strokeWidth={1.7}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);

export const CheckIcon = () => (
  <svg {...base} strokeWidth={2}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
