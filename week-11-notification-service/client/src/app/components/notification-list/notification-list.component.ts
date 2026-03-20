import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  typeFilter = signal<string>('ALL');
  readFilter = signal<string>('ALL');

  NotificationType = NotificationType;

  filteredNotifications = computed(() => {
    let result = this.notifications();
    if (this.typeFilter() !== 'ALL') {
      const t = Number(this.typeFilter());
      result = result.filter(n => n.type === t);
    }
    if (this.readFilter() === 'UNREAD') result = result.filter(n => !n.isRead);
    if (this.readFilter() === 'READ') result = result.filter(n => n.isRead);
    return result;
  });

  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.notificationService.getAll().subscribe({
      next: (items) => {
        this.notifications.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load notifications. Make sure the server is running.');
        this.loading.set(false);
      }
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) return;
    this.notificationService.markAsRead(notification.id, notification).subscribe({
      next: (updated) => {
        this.notifications.update(items => items.map(n => n.id === updated.id ? updated : n));
      },
      error: () => this.error.set('Failed to mark notification as read.')
    });
  }

  delete(id: number): void {
    this.notificationService.delete(id).subscribe({
      next: () => this.notifications.update(items => items.filter(n => n.id !== id)),
      error: () => this.error.set('Failed to delete notification.')
    });
  }

  getTypeLabel(type: NotificationType): string {
    switch (type) {
      case NotificationType.Email:   return 'Email';
      case NotificationType.Webhook: return 'Webhook';
      case NotificationType.InApp:   return 'In-App';
      default: return 'Unknown';
    }
  }

  getTypeIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.Email:   return '&#9993;';
      case NotificationType.Webhook: return '&#128279;';
      case NotificationType.InApp:   return '&#128276;';
      default: return '&#9679;';
    }
  }

  getTypeClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.Email:   return 'type-email';
      case NotificationType.Webhook: return 'type-webhook';
      case NotificationType.InApp:   return 'type-inapp';
      default: return '';
    }
  }
}
