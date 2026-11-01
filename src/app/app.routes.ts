import { Routes } from '@angular/router';
import { Home } from './pages/home';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'carte',
    loadComponent: () => import('./pages/menu-page').then((page) => page.MenuPage),
  },
  {
    path: 'emplacements',
    loadComponent: () => import('./pages/locations-page').then((page) => page.LocationsPage),
  },
  {
    path: 'emplacements/:slug',
    loadComponent: () => import('./pages/place-page').then((page) => page.PlacePage),
  },
  {
    path: 'evenements',
    loadComponent: () => import('./pages/events-page').then((page) => page.EventsPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page').then((page) => page.ContactPage),
  },
  {
    path: 'mentions-legales',
    loadComponent: () => import('./pages/legal-page').then((page) => page.LegalPage),
  },
  // Prerendered once, then moved to /404.html by scripts/generate-seo-files.mts.
  {
    path: '404',
    loadComponent: () => import('./pages/not-found-page').then((page) => page.NotFoundPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found-page').then((page) => page.NotFoundPage),
  },
];
