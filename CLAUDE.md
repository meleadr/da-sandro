# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The website of Da Sandro, a pizza food truck near Liège (Belgium). `README.md` is the reference for
the stack, the content files, the project rules and deployment; `TODO.md` tracks what is left
before launch. Read both before a non-trivial change. The main requirement is local SEO.

## Commands

Node.js must be 22.22.3 or newer (`.node-version`): the Angular CLI refuses older versions.

```bash
npm start                                      # dev server, http://localhost:4200
npx ng test --watch=false                      # all tests, single run (Vitest)
npx ng test --watch=false --include src/app/seo/structured-data.spec.ts   # one spec file
npm run build                                  # preview build + SEO files
npm run check:content                          # what blocks a production build
npm run build:prod                             # production: content check, build, SEO files
npx prettier --write <files>                   # formatting (no linter is configured)
npx wrangler pages dev dist/da-sandro/browser  # serve the build with the form Functions
```

## Architecture

- **Static prerendering only.** `outputMode: "static"`: every route is prerendered at build time
  (`app.routes.server.ts`, with `getPrerenderParams` for `/emplacements/:slug`) and hydrated in the
  browser. There is no Node server in production; Cloudflare Pages serves the files. Code runs
  during prerendering, so anything that depends on the current time or on browser APIs goes in
  `afterNextRender` (see `schedule/service-status.ts`).
- **Content is data.** All site content lives in typed modules in `src/data/` (`types.ts`). Pages
  read them directly; there is no API or CMS. `provisional: true` marks example content, and
  `data/validate-content.ts` (`findPublishErrors`) is the single source for what blocks
  production. It is used by `scripts/check-content.mts`, by `scripts/generate-seo-files.mts` to
  decide whether the site may be indexed, and by its spec.
- **Post-build script.** `scripts/generate-seo-files.mts` runs after every build and writes
  `sitemap.xml`, `robots.txt`, `_headers` (CSP and cache rules), `_routes.json`, moves the
  prerendered `/404/` to `404.html` and rewrites chunk preload URLs to absolute ones. A new static
  route must be added to `STATIC_PATHS` there; a new external resource must be allowed in the CSP.
- **SEO per page.** Each page component calls `Seo.set()` (`seo/seo.ts`) in its constructor with
  title, description, trailing-slash path and optional JSON-LD from `seo/structured-data.ts`.
- **Forms shared with Cloudflare Functions.** `functions/api/*.ts` import the parsing and mail
  code from `src/app/contact/contact-request.ts`, `src/app/events/event-request.ts` and
  `src/app/shared/form-submission.ts`. These files must stay free of Angular imports. The Angular
  forms (Signal Forms) reuse the same validation through `validateTree`.
- **Build flag.** `PHOTO_PLACEHOLDERS` is defined only in the `development` and `preview`
  configurations (`angular.json`) and read through `shared/build-flags.ts`.
- **Trailing slashes.** URLs end with `/` (`TrailingSlashPathLocationStrategy`), matching what
  Cloudflare serves. Internal links and `Seo.set()` paths must follow it.

## Conventions

- Angular 22: standalone components, signals, `inject()`, `@Service()` for services, mostly inline
  templates. The `angular-developer` skill in `.claude/skills/` covers current Angular APIs.
- Code, comments and docs in English; visitor-facing text and URLs in French.
- Commits follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `style:`).
