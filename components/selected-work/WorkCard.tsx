import Image from 'next/image';
import { Fragment, type ReactNode } from 'react';
import type { WorkItem } from '@/data/work';
import { ArrowBadge } from '@/components/ui/ArrowBadge';

/** "*highlighted*" → <em>highlighted</em> */
function highlight(text: string): ReactNode {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith('*') ? <em key={i}>{part.slice(1, -1)}</em> : <Fragment key={i}>{part}</Fragment>,
  );
}

interface WorkCardProps {
  item: WorkItem;
  /** stacking order: the front card paints last */
  zIndex: number;
  /** the front card's images load eagerly */
  priority?: boolean;
}

/** One card of the Selected Work stack (Figma 1140×596 card). */
export function WorkCard({ item, zIndex, priority = false }: WorkCardProps) {
  return (
    <article className={`sw-card sw-${item.key}`} data-key={item.key} aria-roledescription="slide" style={{ zIndex }}>
      <div className="sw-face">
        <div className="sw-glow" aria-hidden="true" />
        {item.images.map((im) => (
          <Image
            key={im.src}
            className={`sw-img ${im.kind}`}
            src={im.src}
            alt={im.alt}
            width={im.width}
            height={im.height}
            priority={priority}
            style={{ left: im.left, top: im.top, width: im.width, height: im.height }}
          />
        ))}
        <div className="sw-copy">
          <div className="sw-top">
            <p className="sw-brand">
              <Image src={item.logo.src} width={item.logo.width} height={item.logo.height} alt="" />
              {item.brand}
            </p>
            <div className="sw-text">
              <h3 className="sw-h">
                {highlight(item.heading[0])}
                <br />
                {highlight(item.heading[1])}
              </h3>
              <p className="sw-p">{item.summary}</p>
            </div>
          </div>
          {/* plain <a>: case studies are standalone pages served from /public */}
          <a className="sw-btn" href={item.href} aria-label={item.ctaLabel}>
            View Case Study <ArrowBadge />
          </a>
        </div>
      </div>
    </article>
  );
}
