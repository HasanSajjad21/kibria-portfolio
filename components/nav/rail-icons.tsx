import type { ReactNode } from 'react';
import type { SectionId } from '@/data/sections';
import { LineIcon } from '@/components/ui/Icon';

/** One icon per section for the right-hand rail. */
export const railIcons: Record<SectionId, ReactNode> = {
  hero: (
    <LineIcon>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
    </LineIcon>
  ),
  experience: (
    <LineIcon>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21v-1a6 6 0 0 1 9-5.2" />
      <path d="m18 14 1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" />
    </LineIcon>
  ),
  'selected-work': (
    <LineIcon>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18M11 13v2h2v-2" />
    </LineIcon>
  ),
  capabilities: (
    <LineIcon>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
      <path d="m10.5 10 1.5 1.5 1.5-1.5" />
    </LineIcon>
  ),
  'engineering-stories': (
    <LineIcon>
      <path d="M8 21h11a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4M10 8h6M10 12h6" />
    </LineIcon>
  ),
  achievements: (
    <LineIcon>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m10 9-3 3 3 3M14 9l3 3-3 3" />
    </LineIcon>
  ),
  contact: (
    <LineIcon>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <circle cx="12" cy="13" r="2" />
      <path d="M8.5 18a3.5 3.5 0 0 1 7 0" />
    </LineIcon>
  ),
};
