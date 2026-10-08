import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ExperienceItem } from '@/data/experience';

interface ExperienceRowProps {
  item: ExperienceItem;
  index: number;
  active: boolean;
}

export function ExperienceRow({ item, index, active }: ExperienceRowProps) {
  const cls = ['xp-row', index === 0 && 'first', active && 'on'].filter(Boolean).join(' ');
  return (
    <li className={cls} style={{ '--i': index } as CSSProperties}>
      <p className="xp-date">{item.period}</p>
      <Image className="xp-logo" src={item.logo} width={68} height={68} alt={`${item.company} logo`} />
      <div className="xp-det">
        <h3 className="xp-co">{item.company}</h3>
        <p className="xp-role">{item.role}</p>
        <p className="xp-focus">{item.focus}</p>
      </div>
    </li>
  );
}
