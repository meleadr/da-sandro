# TODO

`npm run check:content` always gives the current list of missing content.

## Content required before launch

- [ ] Real schedule in `src/data/schedule.ts`, then `provisional: false`
- [ ] Real truck stops in `src/data/places.ts`. Grâce-Hollogne and Liège are examples
- [ ] For each stop: exact address and one or two sentences specific to the place
- [ ] Real Instagram page in `src/data/business.ts`. The current link is a placeholder, and
      `build:prod` refuses it

## To confirm with Sandro

- [ ] Végétarienne price: 11 €, while the Capricciosa costs 10 € with the same ingredients plus ham
- [ ] Legal address: Rue Diérain Patar 55, taken from the establishment unit in the BCE register.
      It is public in the legal notice
- [ ] VAT number: inferred from the company number
- [ ] Public name: "Da Sandro" or "Pizzeria Da Sandro", identical everywhere
- [ ] Facts for the event offer: packages, minimum guests, duration, what is included. The
      `/evenements/` page stays general until then
- [ ] Rights to the truck illustration in the PDF menu, before using it on the site

- [ ] Allergen list available at the truck, as announced on the menu page
- [ ] Prices include VAT, as announced on the menu page
- [ ] Rules for selling beer, including any age notice
- [ ] 12-month retention period announced in the legal notice

## Visuals

- [ ] Final logo, to replace the name in text
- [ ] Mascot redrawn to match the logo, then regenerate the favicon and share image
- [ ] 10 to 15 real photos of the truck, the pizzas and events
- [ ] Add the photos to `public/photos/` and list them in `src/data/photos.ts`

## Launch

- [x] Register `da-sandro.be`
- [x] Create the Cloudflare Pages project with `npm run build` for the non-indexed preview
- [ ] Switch the Cloudflare build command to `npm run build:prod` before launch: this also
      removes the photo placeholders
- [ ] Create the Resend account and verify the sending domain
- [ ] Set `RESEND_API_KEY`, `MAIL_FROM` and `MAIL_TO` in Cloudflare
- [ ] Enable Cloudflare Web Analytics
- [ ] Add a Cloudflare rate limiting rule on `/api/*`
- [x] Create the Google Business Profile as a service area, with no displayed address
- [ ] Verify the Google Business Profile, then add the website, opening hours and photos
- [x] Add the direct review link to `src/data/reviews.ts`
- [ ] Copy the first real reviews to `src/data/reviews.ts`, word for word
- [ ] Add the site and the sitemap to Google Search Console

## Checks after deployment

- [ ] Send a real request through both forms and receive the emails
- [ ] Reply to that email: the reply must go to the customer
- [ ] Try the mobile menu on a real phone
- [ ] Try the phone link, "Y aller" and "Afficher le plan" with real data
- [ ] Check that an unknown URL returns a 404 status
- [ ] Check the pages with Google's Rich Results Test
- [ ] Measure Lighthouse online: 100 for SEO, at least 95 for performance and accessibility
- [ ] Have the legal notice reviewed
- [ ] Test the site with a screen reader (NVDA or VoiceOver)

## Later

- [ ] Add a fixed mobile action bar: "Y aller", "Appeler", "Devis"
- [ ] Add the preferred time to the event form
- [ ] Add "végétarien" and "piquant" badges to the menu
- [ ] Write the Sandro story section and the detailed event offer, with an FAQ
- [ ] Add Cloudflare Turnstile if the forms receive spam
- [ ] Study online ordering: it would need a real server or a dedicated service
