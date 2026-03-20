import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DashboardWidget, CreateWidgetDto } from '../models/dashboard-widget.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<DashboardWidget[]> {
    // TODO: Implement GET request to http://localhost:5000/api/dashboard
    return of([]);
  }

  getById(id: number): Observable<DashboardWidget> {
    // TODO: Implement GET request to http://localhost:5000/api/dashboard/{id}
    return of({} as DashboardWidget);
  }

  create(dto: CreateWidgetDto): Observable<DashboardWidget> {
    // TODO: Implement POST request to http://localhost:5000/api/dashboard
    // Body: dto (title, type, dataSource, config)
    return of({} as DashboardWidget);
  }

  update(id: number, widget: Partial<DashboardWidget>): Observable<DashboardWidget> {
    // TODO: Implement PUT request to http://localhost:5000/api/dashboard/{id}
    // Body: widget (title, type, dataSource, config)
    return of({} as DashboardWidget);
  }

  delete(id: number): Observable<void> {
    // TODO: Implement DELETE request to http://localhost:5000/api/dashboard/{id}
    return of(undefined);
  }
}
