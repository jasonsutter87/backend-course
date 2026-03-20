import { Routes } from '@angular/router';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';

export const routes: Routes = [
  { path: '', component: TicketListComponent },
  { path: 'new', component: TicketFormComponent },
  { path: ':id/edit', component: TicketFormComponent },
  { path: ':id', component: TicketDetailComponent },
  { path: '**', redirectTo: '' }
];
