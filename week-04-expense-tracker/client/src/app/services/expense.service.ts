import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense, CreateExpense } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/expenses';

  getAll(categoryId?: number): Observable<Expense[]> {
    let params = new HttpParams();
    if (categoryId != null) {
      params = params.set('categoryId', categoryId.toString());
    }
    return this.http.get<Expense[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`);
  }

  create(expense: CreateExpense): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, expense);
  }

  update(id: number, expense: CreateExpense): Observable<Expense> {
    return this.http.put<Expense>(`${this.baseUrl}/${id}`, { id, ...expense });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
