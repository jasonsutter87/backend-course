import { Routes } from '@angular/router';
import { SlotListComponent } from './components/slot-list/slot-list.component';
import { BookingListComponent } from './components/booking-list/booking-list.component';
import { SlotFormComponent } from './components/slot-form/slot-form.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

export const routes: Routes = [
  { path: '', component: SlotListComponent },
  { path: 'slots/new', component: SlotFormComponent },
  { path: 'bookings', component: BookingListComponent },
  { path: 'book/:slotId', component: BookingFormComponent }
];
