import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/recipe-list/recipe-list.component').then(m => m.RecipeListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./components/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent)
  },
  { path: '**', redirectTo: '' }
];
