import { Routes } from '@angular/router';
import { ContactPage } from './pages/contact-page';
import { EventsPage } from './pages/events-page';
import { Home } from './pages/home';
import { LegalPage } from './pages/legal-page';
import { LocationsPage } from './pages/locations-page';
import { MenuPage } from './pages/menu-page';
import { NotFoundPage } from './pages/not-found-page';
import { PlacePage } from './pages/place-page';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'carte', component: MenuPage },
  { path: 'emplacements', component: LocationsPage },
  { path: 'emplacements/:slug', component: PlacePage },
  { path: 'evenements', component: EventsPage },
  { path: 'contact', component: ContactPage },
  { path: 'mentions-legales', component: LegalPage },
  // Prerendered once, then moved to /404.html by scripts/generate-seo-files.mts.
  { path: '404', component: NotFoundPage },
  { path: '**', component: NotFoundPage },
];
