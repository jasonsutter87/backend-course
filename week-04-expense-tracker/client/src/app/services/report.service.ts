import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonthlyReport, CategoryReport } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/reports';

  getMonthly(year?: number, month?: number): Observable<MonthlyReport> {
    let params = new HttpParams();
    if (year != null) params = params.set('year', year.toString());
    if (month != null) params = params.set('month', month.toString());
    return this.http.get<MonthlyReport>(`${this.baseUrl}/monthly`, { params });
  }

  getByCategory(): Observable<CategoryReport[]> {
    return this.http.get<CategoryReport[]>(`${this.baseUrl}/by-category`);
  }
}
