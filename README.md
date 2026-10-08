# Sheikh Md. Kibria — Portfolio (Next.js 16)

The portfolio as a Next.js 16 App Router project (React 19, TypeScript). It behaves the same as
the single-file HTML version: same layout, entrance animations, scroll-driven sections, hover
states, contact form and links.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_CONTACT_ENDPOINT` (e.g. a
Formspree URL) so the contact form actually sends. Without it the form validates and shows the
success message but sends nothing.

## Where things live

```
app/
  layout.tsx            fonts (next/font: Oswald, Inter, Albert Sans, JetBrains Mono) + metadata
  page.tsx              the page: sections in order, footer, rail nav
  globals.css           tokens, base styles, keyframes shared by several sections
data/                   ALL copy, links and images paths — edit content here
  site.ts               hero, contact, socials, copyright, replay-button switch
  sections.ts           section ids + rail labels
  experience.ts  work.ts  capabilities.ts  stories.ts  achievements.ts
components/
  ui/                   SectionHeader, ArrowBadge, LineIcon — shared building blocks
  providers/            ReplayProvider ("Replay entrance")
  hero/                 Hero, Portrait (+ ribbon-engine.ts canvas ribbon), ResumeButton
  nav/                  RailNav (+ useActiveSection), ReplayButton
  experience/           Experience, ExperienceRow, useTimeline
  selected-work/        SelectedWork, WorkCard, useCardStack (pinned card flip)
  capabilities/         Capabilities, CodeEditor, CodeLines, useCapabilityTrack, code/ (tokenizer)
  engineering-stories/  EngineeringStories, StoryCard, FlowDiagram, FlowNode, flow-icons, useStoryPager
  achievements/         Achievements, AchievementCard
  contact/              Contact, TalkPrompt, ContactForm
  footer/               Footer, SocialLinks
hooks/                  useEntrance (pre → in entrance), useLatest, useIsomorphicLayoutEffect
lib/motion.ts           clamp / easing / reduced-motion helpers
public/
  images/               portrait, company logos, work mockups
  case-studies/         standalone case-study pages (see below)
```

Each section keeps its styles next to it (`components/<section>/<section>.css`), with
section-prefixed class names (`xp-`, `sw-`, `es-`, `ach-`, `ct-`, `ft-` …).

Scroll-driven motion (timeline, card flip, horizontal capabilities track, story pager) is done
in hooks that write transforms straight to the DOM inside `requestAnimationFrame`, so scrolling
never re-renders React; React state only changes when the active item changes.

## Case studies

The two case studies are self-contained HTML pages served from `public/case-studies/`, with
clean URLs set up in `next.config.ts`:

| Link on the home page | URL | File |
| --- | --- | --- |
| Selected Work → Edulytics → View Case Study | `/case-studies/edulytics` | `public/case-studies/edulytics.html` |
| How I Build → first card → Explore Product | `/engineering-stories/clickhouse-analytics` | `public/case-studies/clickhouse-analytics.html` |

To link another card, add the page to `public/case-studies/`, add a rewrite, and set the card's
`href` in `data/work.ts` or `data/stories.ts`.

## Still to fill in

- `data/site.ts` → `socials`: real profile URLs (currently `#`)
- `data/site.ts` → `contact.title`: the form title from Figma repeats "A Competitive Foundation"
- `data/site.ts` → `hero.cta.href`: link to the resume (currently `#`, does nothing)
- `data/site.ts` → `showReplayButton`: set to `false` to hide the "Replay entrance" control
