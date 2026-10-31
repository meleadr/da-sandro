import { Routes } from '@angular/router';
import { ContactPage } from './pages/contact-page';
import { EventsPage } from './pages/events-page';
import { Home } from './pages/home';
import { LegalPage } from './pages/legal-page';
import { LocationsPage } from './pages/locations-page';
import { MenuPage } from './pages/menu-page';
import { PlacePage } from './pages/place-page';

export const routes: Routes = [
  { path: '', component: Home, title: 'Da Sandro' },
  { path: 'carte', component: MenuPage, title: 'La carte | Da Sandro' },
  { path: 'emplacements', component: LocationsPage, title: 'Emplacements | Da Sandro' },
  { path: 'emplacements/:slug', component: PlacePage, title: 'Emplacement | Da Sandro' },
  { path: 'evenements', component: EventsPage, title: 'Événements | Da Sandro' },
  { path: 'contact', component: ContactPage, title: 'Contact | Da Sandro' },
  { path: 'mentions-legales', component: LegalPage, title: 'Mentions légales | Da Sandro' },
];
