import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-notification-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-detail.component.html',
  styleUrl: './notification-detail.component.css'
})
export class NotificationDetailComponent implements OnInit {
  notification = signal<Notification | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  NotificationType = NotificationType;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    this.notificationService.getById(id).subscribe({
      next: (n) => {
        this.notification.set(n);
        this.loading.set(false);
        if (!n.isRead) {
          this.notificationService.markAsRead(id, n).subscribe();
        }
      },
      error: () => {
        this.error.set('Notification not found or server unavailable.');
        this.loading.set(false);
      }
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

  getTypeClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.Email:   return 'type-email';
      case NotificationType.Webhook: return 'type-webhook';
      case NotificationType.InApp:   return 'type-inapp';
      default: return '';
    }
  }
}
