import { readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { business } from '../src/data/business.ts';
import { menu } from '../src/data/menu.ts';
import { places } from '../src/data/places.ts';
import { schedule } from '../src/data/schedule.ts';
import { findPublishErrors } from '../src/data/validate-content.ts';

const OUTPUT = 'dist/da-sandro/browser';
const STATIC_PATHS = [
  '/',
  '/carte/',
  '/emplacements/',
  '/evenements/',
  '/contact/',
  '/mentions-legales/',
];

// Angular's prerendered pages need inline scripts and styles. Google is only used by the map,
// and Cloudflare Insights by Web Analytics.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://cloudflareinsights.com",
  'frame-src https://www.google.com',
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

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
  '/*',
  '  X-Frame-Options: DENY',
  '  Strict-Transport-Security: max-age=31536000',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  `  Content-Security-Policy: ${CONTENT_SECURITY_POLICY}`,
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
// The empty client-side shell is not used by static output and must not be served.
rmSync(`${OUTPUT}/index.csr.html`, { force: true });

// Cloudflare turns preload tags into Link headers, which ignore <base>: relative chunk URLs
// would then resolve against the page and return 404 on every nested route.
for (const file of readdirSync(OUTPUT, { recursive: true, encoding: 'utf8' })) {
  if (file.endsWith('.html')) {
    const html = readFileSync(`${OUTPUT}/${file}`, 'utf8');
    writeFileSync(`${OUTPUT}/${file}`, html.replace(/href="chunk-/g, 'href="/chunk-'));
  }
}

writeFileSync(`${OUTPUT}/sitemap.xml`, sitemap);
writeFileSync(`${OUTPUT}/robots.txt`, robots);
writeFileSync(`${OUTPUT}/_headers`, headers);
// Only the forms run as Functions: everything else is served as static files.
writeFileSync(
  `${OUTPUT}/_routes.json`,
  JSON.stringify({ version: 1, include: ['/api/*'], exclude: [] }),
);

console.log(`SEO files written (${publishable ? 'indexable' : 'not indexable yet'}).`);
