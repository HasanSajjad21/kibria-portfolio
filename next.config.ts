import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The case studies are standalone, self-contained HTML pages in /public/case-studies.
  // These rewrites give them clean URLs.
  async rewrites() {
    return [
      { source: '/case-studies/edulytics', destination: '/case-studies/edulytics.html' },
      { source: '/engineering-stories/clickhouse-analytics', destination: '/case-studies/clickhouse-analytics.html' },
    ];
  },
};

export default nextConfig;
