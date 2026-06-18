import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth/:mode',
    loadComponent: () =>
      import('./pages/auth-page/auth-page.component').then((m) => m.AuthPageComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search-page/search-page.component').then((m) => m.SearchPageComponent),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
