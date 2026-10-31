import { Routes } from '@angular/router';
import { ContactPage } from './pages/contact-page';
import { Home } from './pages/home';
import { LegalPage } from './pages/legal-page';
import { LocationsPage } from './pages/locations-page';
import { MenuPage } from './pages/menu-page';
import { PagePlaceholder } from './pages/page-placeholder';
import { PlacePage } from './pages/place-page';

export const routes: Routes = [
  { path: '', component: Home, title: 'Da Sandro' },
  { path: 'carte', component: MenuPage, title: 'La carte | Da Sandro' },
  { path: 'emplacements', component: LocationsPage, title: 'Emplacements | Da Sandro' },
  { path: 'emplacements/:slug', component: PlacePage, title: 'Emplacement | Da Sandro' },
  {
    path: 'evenements',
    component: PagePlaceholder,
    title: 'Événements | Da Sandro',
    data: { heading: 'Événements' },
  },
  { path: 'contact', component: ContactPage, title: 'Contact | Da Sandro' },
  { path: 'mentions-legales', component: LegalPage, title: 'Mentions légales | Da Sandro' },
];
