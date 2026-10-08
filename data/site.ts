/** Site-wide copy and links. Edit here; components only render it. */

export const site = {
  name: 'Sheikh Md. Kibria',
  title: 'Sheikh Md. Kibria — Portfolio',
  description:
    'Founding full-stack engineer who turns ambiguous product ideas into shipped software — product engineering, systems architecture and AI.',
};

export const hero = {
  eyebrow: 'Software Engineer',
  /** each entry is one masked row; `accent` gets the cyan shimmer */
  headline: [
    { text: 'I Turn Ambiguous' },
    { text: 'Product Ideas Into' },
    { text: 'Shipped Software', accent: true },
  ],
  cta: { label: 'View Resume', href: '#' },
  role: 'Founding Fullstack Engineer',
  facts: ['B.Sc. in CSE, University of Dhaka', '6+ Years of building software'],
  portrait: { src: '/images/hero/portrait.webp', width: 1506, height: 1364, alt: 'Portrait of Sheikh Md. Kibria' },
  ribbonText:
    'Product engineering, systems architecture, AI engineering, full-stack execution, infrastructure, technical leadership.',
};

export const contact = {
  heading: 'LET’S TALK',
  eyebrow: 'Contact',
  /** NOTE: this is the title in the Figma frame (it repeats the Achievements title) — replace it */
  title: 'A Competitive Foundation',
  /**
   * Where the form posts (e.g. a Formspree URL). Leave empty and the form only validates and
   * shows the success message without sending anything.
   */
  endpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '',
  messages: {
    sent: 'Thanks — your message has been sent.',
    failed: 'Something went wrong. Please try again.',
    missing: 'Please fill in all fields.',
    email: 'Please enter a valid email address.',
    consent: 'Please agree to the Privacy Policies.',
  },
};

export type SocialKey = 'linkedin' | 'github' | 'codeforces' | 'facebook';

/** Replace the `#` hrefs with real profile URLs. */
export const socials: { key: SocialKey; label: string; href: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', href: '#' },
  { key: 'github', label: 'GitHub', href: '#' },
  { key: 'codeforces', label: 'Codeforces', href: '#' },
  { key: 'facebook', label: 'Facebook', href: '#' },
];

export const copyright = '© 2026 Sheikh Md. Kibria | All Rights Reserved';

/** Set to false to hide the floating "Replay entrance" control. */
export const showReplayButton = true;
