import { Routes } from '@angular/router';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { WebhookListComponent } from './components/webhook-list/webhook-list.component';
import { WebhookFormComponent } from './components/webhook-form/webhook-form.component';

export const routes: Routes = [
  { path: '', component: NotificationListComponent },
  { path: 'webhooks', component: WebhookListComponent },
  { path: 'webhooks/add', component: WebhookFormComponent },
  { path: 'webhooks/:id/edit', component: WebhookFormComponent },
  { path: ':id', component: NotificationDetailComponent }
];
