'use client';

import { useRef } from 'react';
import { stories } from '@/data/stories';
import { useEntrance } from '@/hooks/useEntrance';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StoryCard } from './StoryCard';
import { useStoryPager } from './useStoryPager';
import './engineering-stories.css';

/** "How I Build" — engineering stories, one pinned card at a time, each with its flow diagram. */
export function EngineeringStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const { phase, ready } = useEntrance(sectionRef, { minRatio: 0.04, readyDelay: 1100 });
  const active = useStoryPager(sectionRef, stories.length, ready);

  return (
    <section className={`es ${phase}`.trim()} id="engineering-stories" aria-labelledby="es-title" ref={sectionRef}>
      {/* page glow (Figma ellipse 810:26216), rising from the section's top edge */}
      <div className="es-glow" aria-hidden="true" />
      <div className="es-track">
        <div className="es-pin">
          <SectionHeader prefix="es" eyebrow="Engineering Stories" title="How I Build" titleId="es-title" />
          <div className="es-stage">
            {stories.map((story, i) => (
              <StoryCard key={story.title} story={story} index={i} total={stories.length} active={i === active} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
