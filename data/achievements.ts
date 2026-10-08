export interface Achievement {
  metric: string;
  label: [string, string];
  description: string;
  /** widths of the short label and of the full description, in the 1008px layout */
  labelWidth: number;
  descWidth: number;
}

/** Order matters: row 1 = [0], row 2 = [1, 2], row 3 = [3]. */
export const achievements: Achievement[] = [
  {
    metric: '2,000+',
    label: ['Competitive Programming', 'Problems Solved'],
    description:
      'Solved 2,000+ online judge problems across platforms including Codeforces, AtCoder, UVA, HackerEarth, SPOJ, LightOJ, and CodeChef. Reached a max Codeforces rating of 1762 and AtCoder rating of 1562.',
    labelWidth: 197,
    descWidth: 584,
  },
  {
    metric: '18th',
    label: ['Best Inter-University', 'Contest Placement'],
    description:
      'Placed 18th in SUB IUPC 2018, 30th in BUET IUPC 2018, and 35th in LU NPC 2018. These contests strengthened problem solving, speed, and decision-making under strict time constraints.',
    labelWidth: 160,
    descWidth: 431,
  },
  {
    metric: '#1',
    label: ['Best Individual', 'Hackathon Performance'],
    description:
      'Won Best Individual Performance at Code Samurai Hackathon 2019, receiving a MacBook Air as the prize. A strong proof of individual coding ability and performance in a competitive build environment.',
    labelWidth: 185,
    descWidth: 468,
  },
  {
    metric: '2',
    label: ['Verified Professional', 'Technical Certifications'],
    description:
      'Completed the CodeSignal General Coding Assessment covering algorithms and data structures, along with the Upwork Python Test. These certifications provide structured validation of core programming and Python skills.',
    labelWidth: 180,
    descWidth: 584,
  },
];
