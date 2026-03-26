import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiKey, CreateApiKeyDto } from '../models/api-key.model';

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  private baseUrl = 'http://localhost:5000/api/apikeys';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(this.baseUrl);
  }

  getById(id: number): Observable<ApiKey> {
    return this.http.get<ApiKey>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateApiKeyDto): Observable<ApiKey> {
    return this.http.post<ApiKey>(this.baseUrl, dto);
  }

  update(id: number, apiKey: Partial<ApiKey>): Observable<ApiKey> {
    return this.http.put<ApiKey>(`${this.baseUrl}/${id}`, apiKey);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  generate(): Observable<ApiKey> {
    const key = crypto.randomUUID().replace(/-/g, '');
    return this.http.post<ApiKey>(this.baseUrl, {
      key,
      name: 'Generated Key',
      isActive: true,
      rateLimit: 100
    });
  }
}
