import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/expense-list/expense-list.component').then(m => m.ExpenseListComponent)
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/expense-form/expense-form.component').then(m => m.ExpenseFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/expense-form/expense-form.component').then(m => m.ExpenseFormComponent)
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./components/reports/reports.component').then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: '' }
];
