import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // Authentication Routes
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),

    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register').then((m) => m.Register),
      },
    ],
  },

  // User Routes
  {
    path: 'user',
    loadComponent: () => import('./layouts/user-layout/user-layout').then((m) => m.UserLayout),

     canActivate: [authGuard],

    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/product/product-list/product-list').then((m) => m.ProductList),
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./pages/product/product-add/product-add').then((m) => m.ProductAdd),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./pages/product/product-edit/product-edit').then((m) => m.ProductEdit),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/product/product-details/product-details').then((m) => m.ProductDetails),
      },
    ],
  },

  // 404 Route
  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFound),
  },
];
