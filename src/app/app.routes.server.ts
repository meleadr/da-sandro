import { RenderMode, ServerRoute } from '@angular/ssr';
import { places } from '../data/places';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'emplacements/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => places.map(({ slug }) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
