import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WebhookService } from '../../services/webhook.service';

@Component({
  selector: 'app-webhook-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './webhook-form.component.html',
  styleUrl: './webhook-form.component.css'
})
export class WebhookFormComponent implements OnInit {
  isEditMode = signal(false);
  webhookId = signal<number | null>(null);

  url = signal('');
  secret = signal('');
  events = signal('');
  isActive = signal(true);

  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  availableEvents = [
    'notification.created',
    'notification.read',
    'notification.deleted',
    'webhook.triggered',
    'system.error'
  ];

  selectedEvents = signal<Set<string>>(new Set());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webhookService: WebhookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.webhookId.set(Number(id));
      this.loadWebhook(Number(id));
    }
  }

  loadWebhook(id: number): void {
    this.webhookService.getById(id).subscribe({
      next: (w) => {
        this.url.set(w.url);
        this.secret.set(w.secret);
        this.isActive.set(w.isActive);
        const evSet = new Set(w.events.split(',').map(e => e.trim()).filter(Boolean));
        this.selectedEvents.set(evSet);
        this.events.set(w.events);
      },
      error: () => this.error.set('Failed to load webhook data.')
    });
  }

  toggleEvent(event: string): void {
    const current = new Set(this.selectedEvents());
    if (current.has(event)) {
      current.delete(event);
    } else {
      current.add(event);
    }
    this.selectedEvents.set(current);
    this.events.set(Array.from(current).join(', '));
  }

  isEventSelected(event: string): boolean {
    return this.selectedEvents().has(event);
  }

  onSubmit(): void {
    if (!this.url().trim()) {
      this.error.set('Webhook URL is required.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const dto = {
      url: this.url().trim(),
      secret: this.secret().trim(),
      events: this.events().trim(),
      isActive: this.isActive()
    };

    if (this.isEditMode() && this.webhookId()) {
      this.webhookService.update(this.webhookId()!, dto).subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set('Webhook updated successfully!');
          setTimeout(() => this.router.navigate(['/webhooks']), 1200);
        },
        error: () => {
          this.submitting.set(false);
          this.error.set('Failed to update webhook. Make sure the server is running.');
        }
      });
    } else {
      this.webhookService.create(dto).subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set('Webhook created successfully!');
          setTimeout(() => this.router.navigate(['/webhooks']), 1200);
        },
        error: () => {
          this.submitting.set(false);
          this.error.set('Failed to create webhook. Make sure the server is running.');
        }
      });
    }
  }
}
