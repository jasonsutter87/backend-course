import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WebhookService } from '../../services/webhook.service';
import { Webhook } from '../../models/webhook.model';

@Component({
  selector: 'app-webhook-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './webhook-list.component.html',
  styleUrl: './webhook-list.component.css'
})
export class WebhookListComponent implements OnInit {
  webhooks = signal<Webhook[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private webhookService: WebhookService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.webhookService.getAll().subscribe({
      next: (items) => {
        this.webhooks.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load webhooks. Make sure the server is running.');
        this.loading.set(false);
      }
    });
  }

  toggleActive(webhook: Webhook): void {
    this.webhookService.update(webhook.id, { ...webhook, isActive: !webhook.isActive }).subscribe({
      next: (updated) => this.webhooks.update(items => items.map(w => w.id === updated.id ? updated : w)),
      error: () => this.error.set('Failed to update webhook.')
    });
  }

  delete(id: number): void {
    if (!confirm('Delete this webhook? This action cannot be undone.')) return;
    this.webhookService.delete(id).subscribe({
      next: () => this.webhooks.update(items => items.filter(w => w.id !== id)),
      error: () => this.error.set('Failed to delete webhook.')
    });
  }

  getEventsList(events: string): string[] {
    return events ? events.split(',').map(e => e.trim()).filter(Boolean) : [];
  }
}
