import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from '../models/time-slot.model';

@Injectable({ providedIn: 'root' })
export class SlotService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/slots';

  getAll(): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(this.baseUrl);
  }

  getById(id: number): Observable<TimeSlot> {
    return this.http.get<TimeSlot>(`${this.baseUrl}/${id}`);
  }

  create(slot: Omit<TimeSlot, 'id' | 'isAvailable'>): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(this.baseUrl, { ...slot, isAvailable: true });
  }

  update(id: number, slot: TimeSlot): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, slot);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
