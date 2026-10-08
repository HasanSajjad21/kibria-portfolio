/** The page sections, in order. The rail nav and the section ids both come from here. */

export type SectionId =
  | 'hero'
  | 'experience'
  | 'selected-work'
  | 'capabilities'
  | 'engineering-stories'
  | 'achievements'
  | 'contact';

export const sections: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'experience', label: 'Experience' },
  { id: 'selected-work', label: 'Selected Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'engineering-stories', label: 'Engineering Stories' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];
