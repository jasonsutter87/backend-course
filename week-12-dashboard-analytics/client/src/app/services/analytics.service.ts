import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AnalyticsSummary, DataPoint } from '../models/data-point.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<AnalyticsSummary> {
    // TODO: Implement GET request to http://localhost:5000/api/analytics/summary
    // Returns: { totalDataPoints: number, total?, average?, min?, max? }
    return of({ totalDataPoints: 0 });
  }

  getTrend(category?: string, from?: string, to?: string): Observable<DataPoint[]> {
    // TODO: Implement GET request to http://localhost:5000/api/analytics/trend
    // Query params: category, from (ISO date string), to (ISO date string)
    // Example: /api/analytics/trend?category=sales&from=2025-01-01&to=2025-12-31
    return of([]);
  }
}
