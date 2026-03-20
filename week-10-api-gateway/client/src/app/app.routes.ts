import { Routes } from '@angular/router';
import { ApiKeyListComponent } from './components/api-key-list/api-key-list.component';
import { ApiKeyFormComponent } from './components/api-key-form/api-key-form.component';
import { RequestLogComponent } from './components/request-log/request-log.component';

export const routes: Routes = [
  { path: '', component: ApiKeyListComponent },
  { path: 'generate', component: ApiKeyFormComponent },
  { path: ':id/logs', component: RequestLogComponent }
];
