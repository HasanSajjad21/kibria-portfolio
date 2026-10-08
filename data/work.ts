/**
 * Selected Work cards, front card first. Image boxes are in the 1140×596 Figma card space
 * (the card is scaled as a whole, so these stay exact at any size).
 */

export type WorkKey = 'uh' | 'ie' | 'ed';

export interface WorkImage {
  src: string;
  alt: string;
  /** class used by the phone layout: m1 = main mockup, m2 = second mockup, sp = sparkle */
  kind: 'm1' | 'm2' | 'sp';
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface WorkItem {
  key: WorkKey;
  brand: string;
  logo: { src: string; width: number; height: number };
  /** two lines; text inside *asterisks* is highlighted */
  heading: [string, string];
  summary: string;
  href: string;
  ctaLabel?: string;
  images: WorkImage[];
}

export const work: WorkItem[] = [
  {
    key: 'uh',
    brand: 'United Healthcare',
    logo: { src: '/images/work/united-healthcare-logo.png', width: 43, height: 48 },
    heading: ['A clearer digital', '*healthcare experience*'],
    summary:
      'A unified healthcare experience helping patients discover doctors, access diagnostics, manage bookings and health records, and navigate hospital services across web and mobile.',
    href: '#selected-work',
    images: [
      { src: '/images/work/united-healthcare-mock.webp', alt: 'United Healthcare website and mobile app', kind: 'm1', left: 234, top: 95, width: 906, height: 476 },
    ],
  },
  {
    key: 'ie',
    brand: 'IELTS Edulytics',
    logo: { src: '/images/work/ielts-logo.png', width: 50, height: 48 },
    heading: ['An end-to-end', '*IELTS learning* platform.'],
    summary:
      'A personalised learning and assessment platform combining IELTS practice, mock exams, AI evaluation and feedback, speaking, analytics, and adaptive learning experiences.',
    href: '#selected-work',
    images: [
      { src: '/images/work/ielts-mock.webp', alt: 'IELTS Edulytics mobile app screens', kind: 'm1', left: 422, top: 37, width: 718, height: 559 },
    ],
  },
  {
    key: 'ed',
    brand: 'Edulytics',
    logo: { src: '/images/work/edulytics-logo.png', width: 51, height: 44 },
    heading: ['AI-native *school*', '*management* platform'],
    summary:
      'A connected school operating system bringing academics, administration, finance, communication, analytics, mobile experiences, and AI-powered workflows into one platform.',
    href: '/case-studies/edulytics',
    ctaLabel: 'View the Edulytics case study',
    images: [
      { src: '/images/work/edulytics-tablet.webp', alt: 'Edulytics timetable dashboard on a tablet', kind: 'm1', left: 447, top: 28, width: 693, height: 568 },
      { src: '/images/work/edulytics-phone.webp', alt: 'Edulytics mobile app', kind: 'm2', left: 318, top: 177, width: 582, height: 454 },
      { src: '/images/work/sparkle.png', alt: '', kind: 'sp', left: 541, top: 158, width: 29, height: 31 },
    ],
  },
];
