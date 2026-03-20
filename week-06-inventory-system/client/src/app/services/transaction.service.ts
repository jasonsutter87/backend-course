import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/transactions';

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  getByProductId(productId: number): Observable<Transaction[]> {
    return this.getAll().pipe(
      map(transactions => transactions.filter(t => t.productId === productId))
    );
  }

  create(transaction: Omit<Transaction, 'id' | 'timestamp'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
