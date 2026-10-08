import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Albert_Sans, Inter, JetBrains_Mono, Oswald } from 'next/font/google';
import { site } from '@/data/site';
import './globals.css';

// Fonts are self-hosted by next/font and exposed as CSS variables used throughout the CSS.
const oswald = Oswald({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-oswald', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter', display: 'swap' });
const albertSans = Albert_Sans({ subsets: ['latin'], weight: ['600'], variable: '--font-albert', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: '#141414',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} ${albertSans.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
