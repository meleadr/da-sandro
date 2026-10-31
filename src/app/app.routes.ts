import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { PagePlaceholder } from './pages/page-placeholder';

export const routes: Routes = [
  { path: '', component: Home, title: 'Da Sandro' },
  {
    path: 'carte',
    component: PagePlaceholder,
    title: 'La carte | Da Sandro',
    data: { heading: 'La carte' },
  },
  {
    path: 'emplacements',
    component: PagePlaceholder,
    title: 'Emplacements | Da Sandro',
    data: { heading: 'Emplacements' },
  },
  {
    path: 'evenements',
    component: PagePlaceholder,
    title: 'Événements | Da Sandro',
    data: { heading: 'Événements' },
  },
  {
    path: 'contact',
    component: PagePlaceholder,
    title: 'Contact | Da Sandro',
    data: { heading: 'Contact' },
  },
  {
    path: 'mentions-legales',
    component: PagePlaceholder,
    title: 'Mentions légales | Da Sandro',
    data: { heading: 'Mentions légales' },
  },
];
