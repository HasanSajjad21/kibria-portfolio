import type { Story } from '@/data/stories';
import { FlowDiagram } from './FlowDiagram';

interface StoryCardProps {
  story: Story;
  index: number;
  total: number;
  /** the card currently shown in the pinned view */
  active: boolean;
}

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** One engineering story: copy on the left, its flow diagram on the right. */
export function StoryCard({ story, index, total, active }: StoryCardProps) {
  return (
    <article
      className={active ? 'es-card on' : 'es-card'}
      data-i={index}
      aria-roledescription="slide"
      aria-label={`Story ${index + 1} of ${total}`}
      aria-hidden={!active}
    >
      <div className="es-copy">
        <h3 className="es-h">{story.title}</h3>
        <p className="es-brand">{story.brand}</p>
        <p className="es-p">{story.body}</p>
        <ul className="es-tags">
          {story.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {/* plain <a>: the stories are standalone pages served from /public */}
        <a className="es-link" href={story.href}>
          Explore Product <Arrow />
        </a>
      </div>
      <div className="es-fig">
        <FlowDiagram flow={story.flow} />
      </div>
    </article>
  );
}
