import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'http://localhost:5000/api/contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  getById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  create(contact: Omit<Contact, 'id' | 'createdAt'>): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  update(id: number, contact: Omit<Contact, 'id' | 'createdAt'>): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, contact);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(query: string): Observable<Contact[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Contact[]>(`${this.baseUrl}/search`, { params });
  }
}
