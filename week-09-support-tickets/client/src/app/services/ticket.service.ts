import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, CreateTicketDto, TicketStatus } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/tickets';

  getAll(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseUrl);
  }

  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  create(ticket: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, ticket);
  }

  update(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${id}`, { id, ...ticket });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, status: TicketStatus): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.baseUrl}/${id}/status`, status);
  }

  assign(id: number, assignedTo: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.baseUrl}/${id}/assign`, JSON.stringify(assignedTo), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
