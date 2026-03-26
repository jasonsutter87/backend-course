import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Webhook, CreateWebhookDto } from '../models/webhook.model';

@Injectable({ providedIn: 'root' })
export class WebhookService {
  private baseUrl = 'http://localhost:5000/api/webhooks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Webhook[]> {
    return this.http.get<Webhook[]>(this.baseUrl);
  }

  getById(id: number): Observable<Webhook> {
    return this.http.get<Webhook>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateWebhookDto): Observable<Webhook> {
    return this.http.post<Webhook>(this.baseUrl, dto);
  }

  update(id: number, webhook: Partial<Webhook>): Observable<Webhook> {
    return this.http.put<Webhook>(`${this.baseUrl}/${id}`, webhook);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
