import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestLog } from '../models/request-log.model';

@Injectable({ providedIn: 'root' })
export class RequestLogService {
  private baseUrl = 'http://localhost:5000/api/requestlogs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RequestLog[]> {
    return this.http.get<RequestLog[]>(this.baseUrl);
  }

  getByApiKeyId(apiKeyId: number): Observable<RequestLog[]> {
    return this.http.get<RequestLog[]>(`${this.baseUrl}?apiKeyId=${apiKeyId}`);
  }
}
