import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    // Clicks made before hydration ends (menu, "Appeler") are replayed instead of lost.
    provideClientHydration(withEventReplay()),
    // Pages are served at /carte/: without this, every internal link would redirect.
    { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
  ],
};
