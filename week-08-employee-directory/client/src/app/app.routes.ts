import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { DepartmentListComponent } from './components/department-list/department-list.component';
import { DepartmentFormComponent } from './components/department-form/department-form.component';

export const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'add', component: EmployeeFormComponent },
  { path: ':id/edit', component: EmployeeFormComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'departments/add', component: DepartmentFormComponent },
  { path: 'departments/:id/edit', component: DepartmentFormComponent },
  { path: '**', redirectTo: '' }
];
