import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Notification, CreateNotificationDto } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    // TODO: Implement GET request to http://localhost:5000/api/notifications
    return of([]);
  }

  getById(id: number): Observable<Notification> {
    // TODO: Implement GET request to http://localhost:5000/api/notifications/{id}
    return of({} as Notification);
  }

  create(dto: CreateNotificationDto): Observable<Notification> {
    // TODO: Implement POST request to http://localhost:5000/api/notifications
    return of({} as Notification);
  }

  markAsRead(id: number, notification: Notification): Observable<Notification> {
    // TODO: Implement PUT request to http://localhost:5000/api/notifications/{id}
    return of({} as Notification);
  }

  delete(id: number): Observable<void> {
    // TODO: Implement DELETE request to http://localhost:5000/api/notifications/{id}
    return of(undefined);
  }
}
