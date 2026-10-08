import type { Ref } from 'react';

interface SectionHeaderProps {
  /** class prefix of the section, e.g. "xp" → .xp-head / .xp-eyebrow / .xp-title */
  prefix: string;
  eyebrow: string;
  title: string;
  titleId?: string;
  as?: 'h2' | 'h3';
  ref?: Ref<HTMLElement>;
}

/**
 * Eyebrow + title used by every section. The title text sits in a span so it can rise
 * out of the title's overflow mask during the entrance.
 */
export function SectionHeader({ prefix, eyebrow, title, titleId, as: Heading = 'h2', ref }: SectionHeaderProps) {
  return (
    <header className={`${prefix}-head`} ref={ref}>
      <p className={`${prefix}-eyebrow`}>{eyebrow}</p>
      <Heading className={`${prefix}-title`} id={titleId}>
        <span>{title}</span>
      </Heading>
    </header>
  );
}
