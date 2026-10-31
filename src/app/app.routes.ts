import { Routes } from '@angular/router';
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
  {
    path: 'evenements',
    loadComponent: () => import('./pages/events-page').then((page) => page.EventsPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page').then((page) => page.ContactPage),
  },
  { path: 'mentions-legales', component: LegalPage },
  // Prerendered once, then moved to /404.html by scripts/generate-seo-files.mts.
  { path: '404', component: NotFoundPage },
  { path: '**', component: NotFoundPage },
];
