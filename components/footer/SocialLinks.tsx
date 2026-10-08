import type { ReactNode } from 'react';
import { type SocialKey, socials } from '@/data/site';

const icons: Record<SocialKey, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M8 10.5V16.5M8 7.6v.01M11.5 16.5v-6M11.5 13c0-1.6 1-2.6 2.4-2.6s2.3 1 2.3 2.6v3.5" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2.2z" />
    </svg>
  ),
  codeforces: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3.5" y="10" width="4.6" height="9.5" rx="1.1" />
      <rect x="9.7" y="5" width="4.6" height="14.5" rx="1.1" />
      <rect x="15.9" y="12.2" width="4.6" height="7.3" rx="1.1" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.6 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.5-1.5h1.6V4.3a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21z" />
    </svg>
  ),
};

/** Social profile buttons. Links still set to "#" do nothing when clicked. */
export function SocialLinks() {
  return (
    <nav className="ft-social" aria-label="Social profiles">
      {socials.map(({ key, label, href }) => (
        <a
          key={key}
          className="ft-s"
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          onClick={href === '#' ? (e) => e.preventDefault() : undefined}
        >
          {icons[key]}
        </a>
      ))}
    </nav>
  );
}
