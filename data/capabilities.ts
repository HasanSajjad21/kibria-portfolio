/** Capabilities — one "source file" per capability, each in its own language. */

export type CapLang = 'py' | 'ts' | 'md' | 'js' | 'sql' | 'cpp';

export interface Capability {
  name: string;
  file: string;
  lang: CapLang;
  badge: string;
  langName: string;
  /** shown as that language's comment / docstring, re-wrapped to the panel width */
  desc: string[];
  code: string;
}

export const capabilities: Capability[] = [
  {
    name: 'Product Engineering',
    file: 'product.py',
    lang: 'py',
    badge: 'PY',
    langName: 'Python',
    desc: [
      'I work beyond implementation — turning incomplete requirements into products that people can actually use.',
      'At Edulytics, I worked across product architecture, school workflows, dashboards, AI features, mobile experiences, and delivery. For IELTS Edulytics, I helped translate learning requirements into assessment, personalisation, and AI-powered product workflows.',
      'With United Healthcare, the work involved turning complex business and healthcare requirements into clear information architecture and frontend experiences. At Shaped, I worked across the customer-facing analytics product, from product requirements through APIs and UI.',
    ],
    code: `class ProductEngineer:
    def build(self, requirement):
        workflow = define_workflow(requirement)
        product = implement(workflow)
        return ship(product)`,
  },
  {
    name: 'Systems Architecture',
    file: 'architecture.ts',
    lang: 'ts',
    badge: 'TS',
    langName: 'TypeScript',
    desc: [
      'I design systems around the problem and its constraints — not around using more technologies.',
      'At Shaped, I worked on an analytics architecture using Next.js, FastAPI, MySQL, and ClickHouse. At Zoop.One, I designed backend architecture for real-time document workflows using WebSockets, Redis, Node.js, and MongoDB.',
      'At MoEVing, I worked on backend systems, database schemas, and GraphQL/REST APIs supporting products with 10,000+ daily users. These projects required thinking about data flow, communication, persistence, scalability, and how different parts of the system fit together.',
    ],
    code: `interface System {
  api: API;
  data: DataLayer;
  services: Service[];
}

const architecture: System = {
  api,
  data,
  services,
};`,
  },
  {
    name: 'Technical Leadership',
    file: 'README.md',
    lang: 'md',
    badge: 'MD',
    langName: 'Markdown',
    desc: [
      'I see technical leadership as helping people make clear decisions and move a product forward — not simply having a leadership title.',
      'At Shaped, I worked across product architecture, APIs, frontend, and cloud instead of operating inside a narrow engineering layer. At Edulytics, the work involved cross-functional ownership across product, frontend, backend, AI, mobile, and cloud while collaborating with designers and guiding teammates.',
      'That experience includes architecture decisions, design collaboration, mentoring, code reviews, technical direction, and cross-team communication.',
    ],
    code: `## Technical Direction

- Align product and engineering
- Review architecture decisions
- Guide implementation
- Keep delivery moving`,
  },
  {
    name: 'Full-stack Execution',
    file: 'system.js',
    lang: 'js',
    badge: 'JS',
    langName: 'JavaScript',
    desc: [
      'I’m comfortable moving across technical layers when the product needs it.',
      'Across Edulytics, I worked through web, APIs, AI, mobile, and cloud. IELTS Edulytics combines web, AI-powered assessment, and mobile experiences. At Shaped, the stack crossed Next.js, FastAPI, MySQL, ClickHouse, and cloud infrastructure.',
      'My work at MoEVing included Python, FastAPI, MySQL, Redis, AWS, React, and React Native, while Zoop.One involved Next.js, Node.js, WebSockets, Redis, MongoDB, and GCP. The goal is not to own every technology — it is to cross boundaries when owning the product requires it.',
    ],
    code: `const product = await build({
  frontend,
  api,
  backend,
  mobile,
  cloud,
});

ship(product);`,
  },
  {
    name: 'Data & Infrastructure',
    file: 'analytics.sql',
    lang: 'sql',
    badge: 'SQL',
    langName: 'SQL',
    desc: [
      'For me, engineering does not stop when a feature works locally. The system still has to be deployed, operated, observed, and scaled in production.',
      'At Shaped, end-to-end ownership included cloud deployment. At Zoop.One, I worked with containerised systems using Docker, Kubernetes, and GCP. At MoEVing, the production environment included AWS, Docker, Redis, MySQL, and Elasticsearch.',
      'This means thinking beyond deployment itself — into networking, observability, scaling, and the operational cost of keeping software running reliably.',
    ],
    code: `SELECT
  product,
  COUNT(*) AS events,
  AVG(response_time) AS latency
FROM analytics
GROUP BY product;`,
  },
  {
    name: 'Engineering & Problem Solving',
    file: 'engine.cpp',
    lang: 'cpp',
    badge: 'C++',
    langName: 'C++',
    desc: [
      'I think about AI as one part of a product system — not as a standalone chatbot or API call.',
      'At OpenAI, I worked on projects involving programming, reasoning, tools, browsing, Python, JavaScript, and algorithmic problem solving. With IELTS Edulytics, AI became part of an assessment and learning flow: user input, evaluation, structured output, validation, feedback, and personalisation.',
      'In Edulytics, AI sits inside broader school workflows rather than being isolated from the product. My work at Shaped also gave me experience around ML-driven product and analytics systems.',
    ],
    code: `class Engineer {
public:
    void solve(Problem problem) {
        auto solution = design(problem);
        build(solution);
        ship();
    }
};`,
  },
];
