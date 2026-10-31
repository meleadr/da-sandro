import { renameSync, rmSync, writeFileSync } from 'node:fs';
import { business } from '../src/data/business.ts';
import { menu } from '../src/data/menu.ts';
import { places } from '../src/data/places.ts';
import { schedule } from '../src/data/schedule.ts';
import { findPublishErrors } from '../src/data/validate-content.ts';

const OUTPUT = 'dist/da-sandro/browser';
const STATIC_PATHS = ['/', '/carte/', '/emplacements/', '/evenements/', '/contact/', '/mentions-legales/'];

const publishable = findPublishErrors({ business, places, schedule, menu }).length === 0;
const paths = [...STATIC_PATHS, ...places.map(({ slug }) => `/emplacements/${slug}/`)];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${business.siteUrl}${path}</loc></url>`).join('\n')}
</urlset>
`;

const robots = publishable
  ? `User-agent: *\nAllow: /\n\nSitemap: ${business.siteUrl}/sitemap.xml\n`
  : 'User-agent: *\nDisallow: /\n';

// Preview deployments are never indexed, and neither is an unfinished site.
const headers = [
  'https://:project.pages.dev/*',
  '  X-Robots-Tag: noindex',
  ...(publishable ? [] : ['', '/*', '  X-Robots-Tag: noindex']),
  '',
  // Build files have a content hash in their name, so they can be cached for good.
  ...['/main-*', '/styles-*', '/chunk-*'].flatMap((path) => [
    path,
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
  ]),
  '/fonts/*',
  '  Cache-Control: public, max-age=2592000',
  '',
].join('\n');

// Cloudflare Pages answers with a real 404 status as soon as this file exists.
renameSync(`${OUTPUT}/404/index.html`, `${OUTPUT}/404.html`);
rmSync(`${OUTPUT}/404`, { recursive: true });

writeFileSync(`${OUTPUT}/sitemap.xml`, sitemap);
writeFileSync(`${OUTPUT}/robots.txt`, robots);
writeFileSync(`${OUTPUT}/_headers`, headers);
// Only the form runs as a Function: everything else is served as static files.
writeFileSync(
  `${OUTPUT}/_routes.json`,
  JSON.stringify({ version: 1, include: ['/api/*'], exclude: [] }),
);

console.log(`SEO files written (${publishable ? 'indexable' : 'not indexable yet'}).`);
