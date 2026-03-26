import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnalyticsSummary, DataPoint } from '../models/data-point.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private baseUrl = 'http://localhost:5000/api/analytics';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(`${this.baseUrl}/summary`);
  }

  getTrend(category?: string, from?: string, to?: string): Observable<DataPoint[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<DataPoint[]>(`${this.baseUrl}/trend`, { params });
  }
}
