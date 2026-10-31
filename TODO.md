# TODO

`npm run check:content` always gives the current list of missing content.

## Content required before launch

- [ ] Real schedule in `src/data/schedule.ts`, then `provisional: false`
- [ ] Real truck stops in `src/data/places.ts`. Grâce-Hollogne and Liège are examples
- [ ] For each stop: exact address and one or two sentences specific to the place
- [ ] Real Facebook and Instagram pages in `src/data/business.ts`. The current links are
      placeholders, and `build:prod` refuses them

## To confirm with Sandro

- [ ] Végétarienne price: 11 €, while the Capricciosa costs 10 € with the same ingredients plus ham
- [ ] Legal address: Rue Diérain Patar 55, taken from the establishment unit in the BCE register.
      It is public in the legal notice
- [ ] VAT number: inferred from the company number
- [ ] Public name: "Da Sandro" or "Pizzeria Da Sandro", identical everywhere
- [ ] Facts for the event offer: packages, minimum guests, duration, what is included. The
      `/evenements/` page stays general until then
- [ ] Rights to the truck illustration in the PDF menu, before using it on the site

## Visuals

- [ ] Final logo, to replace the name in text
- [ ] Mascot redrawn to match the logo, then regenerate the favicon and share image
- [ ] Real photos of the truck and the pizzas

## Launch

- [ ] Register `da-sandro.be`, or update `siteUrl` if another domain is chosen
- [ ] Create the Cloudflare Pages project with `npm run build` for the non-indexed preview
- [ ] Switch the Cloudflare build command to `npm run build:prod` before launch
- [ ] Create the Resend account and verify the sending domain
- [ ] Set `RESEND_API_KEY`, `MAIL_FROM` and `MAIL_TO` in Cloudflare
- [ ] Enable Cloudflare Web Analytics
- [ ] Create the Google Business Profile as a service area, with no displayed address
- [ ] Add the site and the sitemap to Google Search Console

## Checks after deployment

- [ ] Send a real request through both forms and receive the emails
- [ ] Reply to that email: the reply must go to the customer
- [ ] Try the mobile menu on a real phone
- [ ] Try "Appeler", "Y aller" and "Afficher la carte" with real data
- [ ] Check that an unknown URL returns a 404 status
- [ ] Check the pages with Google's Rich Results Test
- [ ] Measure Lighthouse online: 100 for SEO, at least 95 for performance and accessibility
- [ ] Have the legal notice reviewed

## Later

- [ ] Add Cloudflare Turnstile if the forms receive spam
- [ ] Study online ordering: it would need a real server or a dedicated service
