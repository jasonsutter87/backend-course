import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RequestLog } from '../models/request-log.model';

@Injectable({ providedIn: 'root' })
export class RequestLogService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<RequestLog[]> {
    // TODO: Implement GET request to http://localhost:5000/api/requestlogs
    return of([]);
  }

  getByApiKeyId(apiKeyId: number): Observable<RequestLog[]> {
    // TODO: Implement GET request to http://localhost:5000/api/requestlogs?apiKeyId={apiKeyId}
    return of([]);
  }
}
