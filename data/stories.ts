/**
 * Engineering stories. Each flow is a grid of nodes plus the edges between them; the
 * connectors are drawn at runtime from the nodes' real positions.
 *   h = straight, right edge → left edge
 *   b = branch: right, then up/down, then right
 *   d = drop: bottom of a → round the corner → top of b
 */
import type { FlowIconName } from '@/components/engineering-stories/flow-icons';

export interface FlowNodeSpec {
  key: string;
  icon: FlowIconName;
  /** use \n for a two-line label */
  label: string;
  sub?: string;
  /** CSS grid-area */
  area?: string;
}

export interface FlowSpec {
  layout: 'stack' | 'row' | 'grid2';
  nodes: FlowNodeSpec[];
  edges: { from: string; to: string; kind: 'h' | 'b' | 'd' }[];
  /** read out to screen readers */
  label: string;
}

export interface Story {
  title: string;
  brand: string;
  body: string;
  tags: string[];
  href: string;
  flow: FlowSpec;
}

const productStack: FlowSpec = {
  layout: 'stack',
  label: 'Flow: Product to Next.js to FastAPI, which writes to MySQL for the app and ClickHouse for analytics',
  nodes: [
    { key: 'p', icon: 'box', label: 'Product', area: '1/1/3/2' },
    { key: 'n', icon: 'next', label: 'Next.js', area: '1/2/3/3' },
    { key: 'f', icon: 'zap', label: 'Fast API', area: '1/3/3/4' },
    { key: 'm', icon: 'db', label: 'MySQL', sub: 'App', area: '1/4/2/5' },
    { key: 'c', icon: 'clickhouse', label: 'ClickHouse', sub: 'Analytics', area: '2/4/3/5' },
  ],
  edges: [
    { from: 'p', to: 'n', kind: 'h' },
    { from: 'n', to: 'f', kind: 'h' },
    { from: 'f', to: 'm', kind: 'b' },
    { from: 'f', to: 'c', kind: 'b' },
  ],
};

export const stories: Story[] = [
  {
    title: 'Why ClickHouse for Analytics?',
    brand: 'SHAPED',
    body: "We're with you all the way from the pilot to beyond.",
    tags: ['Analytics', 'ClickHouse', 'FastAPI'],
    href: '/engineering-stories/clickhouse-analytics',
    flow: productStack,
  },
  {
    title: 'Designing Real-Time Collaboration Zoop.One',
    brand: 'Zoop.One',
    body: 'How WebSockets, Redis and MongoDB worked together to support real-time document interactions.',
    tags: ['WebSockets', 'Redis', 'MongoDB'],
    href: '#engineering-stories',
    flow: {
      layout: 'row',
      label: 'Flow: Clients to WebSocket to Redis to MongoDB',
      nodes: [
        { key: 'a', icon: 'users', label: 'Clients' },
        { key: 'b', icon: 'share', label: 'WebSocket' },
        { key: 'c', icon: 'layers', label: 'Redis' },
        { key: 'd', icon: 'leaf', label: 'MongoDB' },
      ],
      edges: [
        { from: 'a', to: 'b', kind: 'h' },
        { from: 'b', to: 'c', kind: 'h' },
        { from: 'c', to: 'd', kind: 'h' },
      ],
    },
  },
  {
    title: 'Building an AI Feedback Pipeline',
    brand: 'IELTS Edulytics',
    body: 'Turning an LLM response into structured, validated feedback that the product could actually use.',
    tags: ['AI', 'Validation', 'Assessment'],
    href: '#engineering-stories',
    flow: {
      layout: 'grid2',
      label:
        'Flow: Student response, AI evaluation, structured output, validation, domain rules, feedback, student profile, personalisation',
      nodes: [
        { key: 'a0', icon: 'msg', label: 'Student\nResponse', area: '1/1' },
        { key: 'a1', icon: 'brain', label: 'AI\nEvaluation', area: '1/2' },
        { key: 'a2', icon: 'file', label: 'Structured\nOutput', area: '1/3' },
        { key: 'a3', icon: 'shield', label: 'Validation', area: '1/4' },
        { key: 'b0', icon: 'gear', label: 'Domain\nRules', area: '2/1' },
        { key: 'b1', icon: 'chart', label: 'Feedback', area: '2/2' },
        { key: 'b2', icon: 'user', label: 'Student\nProfile', area: '2/3' },
        { key: 'b3', icon: 'target', label: 'Personal-\nisation', area: '2/4' },
      ],
      edges: [
        { from: 'a0', to: 'a1', kind: 'h' },
        { from: 'a1', to: 'a2', kind: 'h' },
        { from: 'a2', to: 'a3', kind: 'h' },
        { from: 'a3', to: 'b0', kind: 'd' },
        { from: 'b0', to: 'b1', kind: 'h' },
        { from: 'b1', to: 'b2', kind: 'h' },
        { from: 'b2', to: 'b3', kind: 'h' },
      ],
    },
  },
  {
    title: 'Designing Async OMR Processing',
    brand: 'Edulytics',
    body: 'What happens when hundreds of answer sheets need processing without slowing down the main application?',
    tags: ['Queues', 'Workers', 'Async'],
    href: '#engineering-stories',
    flow: productStack,
  },
  {
    title: 'From MySQL to Search',
    brand: 'MoEVing',
    body: 'Separating operational data from search by extracting and indexing it into Elasticsearch.',
    tags: ['MySQL', 'Elasticsearch', 'Search'],
    href: '#engineering-stories',
    flow: {
      layout: 'grid2',
      label: 'Flow: MySQL, data extraction, indexing, Elasticsearch, search API, user',
      nodes: [
        { key: 'a0', icon: 'db', label: 'MySQL', area: '1/1' },
        { key: 'a1', icon: 'filedown', label: 'Data\nExtraction', area: '1/2' },
        { key: 'a2', icon: 'layers', label: 'Indexing', area: '1/3' },
        { key: 'a3', icon: 'elastic', label: 'Elasticsearch', area: '1/4' },
        { key: 's', icon: 'api', label: 'Search API', area: '2/2' },
        { key: 'u', icon: 'user', label: 'User', area: '2/3' },
      ],
      edges: [
        { from: 'a0', to: 'a1', kind: 'h' },
        { from: 'a1', to: 'a2', kind: 'h' },
        { from: 'a2', to: 'a3', kind: 'h' },
        { from: 'a3', to: 's', kind: 'd' },
        { from: 's', to: 'u', kind: 'h' },
      ],
    },
  },
];
