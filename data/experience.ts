export interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  focus: string;
  logo: string;
}

export const experience: ExperienceItem[] = [
  {
    period: '2023 — Now',
    company: 'Shaped.AI',
    role: 'Founding Software Engineer',
    focus: 'Recommendation / search / analytics systems',
    logo: '/images/experience/shaped.png',
  },
  {
    period: '2022 — 2023',
    company: 'OpenAI',
    role: 'Prompt Engineer',
    focus: 'Programming / Reasoning / Model Training / Tools',
    logo: '/images/experience/openai.png',
  },
  {
    period: '2022',
    company: 'Zoop.One',
    role: 'Senior Software Engineer',
    focus: 'Real-time collaboration / Contracts / Distributed systems',
    logo: '/images/experience/zoop-one.png',
  },
  {
    period: '2021 — 2022',
    company: 'MoEVing',
    role: 'Software Engineer',
    focus: 'Mobility / Backend systems / 10K+ daily users',
    logo: '/images/experience/moeving.png',
  },
  {
    period: '2020 — 2021',
    company: 'TigerIT',
    role: 'Software Engineer',
    focus: 'Real-time multiplayer systems',
    logo: '/images/experience/tigerit.png',
  },
];
