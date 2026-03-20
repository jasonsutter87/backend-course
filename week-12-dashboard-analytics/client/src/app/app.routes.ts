import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { WidgetFormComponent } from './components/widget-form/widget-form.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'widgets/add', component: WidgetFormComponent },
  { path: 'widgets/:id/edit', component: WidgetFormComponent }
];
