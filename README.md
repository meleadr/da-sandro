# Da Sandro

Website for **Da Sandro**, a pizza food truck in the Liège region of Belgium. It serves two visitors:

- someone hungry, who wants to know where the truck is and when;
- someone planning an event, who wants to request a quote.

Local search ranking is the main requirement of the project. Every page is prerendered as complete
HTML, so Google receives the content without running any JavaScript.

What remains to be done before launch is listed in [TODO.md](TODO.md).

## Stack

- [Angular](https://angular.dev) 22, prerendered at build time (`outputMode: "static"`)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Font Awesome](https://fontawesome.com) SVG icons, imported one by one
- [Vitest](https://vitest.dev) for tests
- [Cloudflare Pages](https://pages.cloudflare.com) for hosting, with a Pages Function for the form
- [Resend](https://resend.com) to send emails

## Getting started

You need Node.js 22.22.3 or newer on the 22 line (see `.node-version`).

```bash
npm install
npm start
```

The site is then available at http://localhost:4200.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Development server |
| `npm test` | Unit tests in watch mode |
| `npx ng test --watch=false` | Unit tests, single run |
| `npm run build` | Full build, even with incomplete content |
| `npm run check:content` | Lists what is missing before launch |
| `npm run build:prod` | Checks the content, then builds. This is the production command |

`npm run build` also runs `scripts/generate-seo-files.mts`, which writes `sitemap.xml`,
`robots.txt`, `_headers`, `_routes.json` and `404.html`.

## Structure

```text
functions/api/event-request.ts   Pages Function behind the form
public/                          Fonts, favicon, share image
scripts/                         Content check and SEO files
src/data/                        All the site content
src/app/
  events/                        Event form and request handling
  layout/                        Header, footer, navigation
  pages/                         One component per route
  schedule/                      Next service calculation and weekly schedule
  seo/                           Meta tags and structured data
  shared/                        Reusable components
```

Code, comments and documentation are in English. Only visitor-facing text and page URLs are in
French.

## Editing the content

All the content lives in `src/data/`. After a change, push the code and Cloudflare redeploys the
site.

| File | Content |
| --- | --- |
| `business.ts` | Name, contact details, legal information, social links, domain |
| `menu.ts` | Pizzas, drinks, prices in cents |
| `places.ts` | Truck stops. Each one creates a page at `/emplacements/<slug>/` |
| `schedule.ts` | Weekly schedule and exceptions |

`provisional: true` marks example content: it blocks `build:prod`, and a provisional place never
reaches the structured data.

### Cancelling or moving a service

Use `exceptions` in `src/data/schedule.ts`:

```ts
exceptions: [
  // Cancels the whole day
  { kind: 'cancelled', date: '2026-12-24' },
  // Cancels a single service on that day
  { kind: 'cancelled', date: '2026-12-25', start: '11:30' },
  // Adds a service, for example to replace a cancelled one
  { kind: 'one-off', date: '2026-12-26', placeSlug: 'liege', start: '18:00', end: '21:30' },
],
```

The site only reflects a change after a redeploy. For a last-minute cancellation, post on social
media too: the service block links to it.

### Adding a place

Add it to `places.ts` with an address and a description specific to that place, then reference its
`slug` in `schedule.ts`. `check:content` refuses a place without a service and two places with the
same description, because Google penalizes pages created only to target a town.

## Rules

- **Next service:** it is calculated in the browser, in Brussels time. The prerendered HTML must
  never announce it, because it would quickly go stale.
- **Wording:** the site says "Prévu ce soir" (planned tonight), never "Ouvert" (open), because it
  cannot know what is happening right now.
- **Privacy:** no cookies and no tracking, so no consent banner. Google Maps only loads after a
  click. Any tool that sets non-essential cookies would require a banner.
- **Legal address:** it only appears in the legal notice. It must stay out of the structured data.
- **Event prices:** they are never displayed. The quote is sent by email.
- **Animations:** they must respect `prefers-reduced-motion` and keep the content visible without
  JavaScript.
- **Content:** nothing is made up. Missing information stays off the site.
- **Accessibility:** orange text on the cardboard background lacks contrast. Orange is for
  backgrounds, not text.

## SEO

- Each page sets its title, description and canonical URL through `src/app/seo/seo.ts`.
- Structured data is generated from `src/data/` by `src/app/seo/structured-data.ts`.
- Internal links end with `/`, like the pages served by Cloudflare.
- While `check:content` fails, the site declares itself non-indexable through `robots.txt` and
  `X-Robots-Tag`. `*.pages.dev` previews are never indexed.

Lighthouse targets on mobile: 100 for SEO, at least 95 for performance and accessibility.

## Event form

The browser sends the request to `/api/event-request`. The Pages Function validates it with the
same rules as the browser (`src/app/events/event-request.ts`), then sends the email through Resend.
Replies go straight to the customer thanks to `reply_to`.

`ng serve` does not run this function, so the form always shows a failure on
http://localhost:4200. To test it locally, create a `.dev.vars` file, which Git ignores:

```ini
RESEND_API_KEY=your_key
MAIL_FROM=Da Sandro <site@da-sandro.be>
MAIL_TO=da.sandro.pizza@gmail.com
```

Then run:

```bash
npm run build
npx wrangler pages dev dist/da-sandro/browser
```

## Deployment

In Cloudflare Pages, connect the repository with these settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build:prod` |
| Output directory | `dist/da-sandro/browser` |
| `NODE_VERSION` variable | `22.22.3` |
| Secret variables | `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` |

The build command must be `build:prod`: this is what prevents publishing incomplete content. The
`MAIL_FROM` domain must be verified in Resend.

To change the domain, edit `siteUrl` in `src/data/business.ts`.
