import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardWidget, CreateWidgetDto } from '../models/dashboard-widget.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DashboardWidget[]> {
    return this.http.get<DashboardWidget[]>(this.baseUrl);
  }

  getById(id: number): Observable<DashboardWidget> {
    return this.http.get<DashboardWidget>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateWidgetDto): Observable<DashboardWidget> {
    return this.http.post<DashboardWidget>(this.baseUrl, dto);
  }

  update(id: number, widget: Partial<DashboardWidget>): Observable<DashboardWidget> {
    return this.http.put<DashboardWidget>(`${this.baseUrl}/${id}`, widget);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
