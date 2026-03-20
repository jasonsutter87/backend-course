import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ApiKey, CreateApiKeyDto } from '../models/api-key.model';

@Injectable({ providedIn: 'root' })
export class ApiKeyService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiKey[]> {
    // TODO: Implement GET request to http://localhost:5000/api/apikeys
    return of([]);
  }

  getById(id: number): Observable<ApiKey> {
    // TODO: Implement GET request to http://localhost:5000/api/apikeys/{id}
    return of({} as ApiKey);
  }

  create(dto: CreateApiKeyDto): Observable<ApiKey> {
    // TODO: Implement POST request to http://localhost:5000/api/apikeys
    // Body: { name: dto.name, rateLimit: dto.rateLimit }
    return of({} as ApiKey);
  }

  update(id: number, apiKey: Partial<ApiKey>): Observable<ApiKey> {
    // TODO: Implement PUT request to http://localhost:5000/api/apikeys/{id}
    // Body: apiKey (name, isActive, rateLimit)
    return of({} as ApiKey);
  }

  delete(id: number): Observable<void> {
    // TODO: Implement DELETE request to http://localhost:5000/api/apikeys/{id}
    return of(undefined);
  }

  generate(): Observable<ApiKey> {
    // TODO: Implement POST request to generate a new API key with a random key string
    // Hint: POST to http://localhost:5000/api/apikeys with a generated key value
    return of({} as ApiKey);
  }
}
