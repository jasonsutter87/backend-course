import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Webhook, CreateWebhookDto } from '../models/webhook.model';

@Injectable({ providedIn: 'root' })
export class WebhookService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Webhook[]> {
    // TODO: Implement GET request to http://localhost:5000/api/webhooks
    return of([]);
  }

  getById(id: number): Observable<Webhook> {
    // TODO: Implement GET request to http://localhost:5000/api/webhooks/{id}
    return of({} as Webhook);
  }

  create(dto: CreateWebhookDto): Observable<Webhook> {
    // TODO: Implement POST request to http://localhost:5000/api/webhooks
    return of({} as Webhook);
  }

  update(id: number, webhook: Partial<Webhook>): Observable<Webhook> {
    // TODO: Implement PUT request to http://localhost:5000/api/webhooks/{id}
    return of({} as Webhook);
  }

  delete(id: number): Observable<void> {
    // TODO: Implement DELETE request to http://localhost:5000/api/webhooks/{id}
    return of(undefined);
  }
}
