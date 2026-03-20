import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiKeyService } from '../../services/api-key.service';
import { ApiKey } from '../../models/api-key.model';

@Component({
  selector: 'app-api-key-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './api-key-list.component.html',
  styleUrl: './api-key-list.component.css'
})
export class ApiKeyListComponent implements OnInit {
  apiKeys = signal<ApiKey[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private apiKeyService: ApiKeyService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.apiKeyService.getAll().subscribe({
      next: (keys) => {
        this.apiKeys.set(keys);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load API keys. Make sure the server is running.');
        this.loading.set(false);
      }
    });
  }

  maskKey(key: string): string {
    if (!key || key.length < 8) return '••••••••';
    return key.substring(0, 8) + '••••••••••••••••';
  }

  toggleActive(apiKey: ApiKey): void {
    this.apiKeyService.update(apiKey.id, { ...apiKey, isActive: !apiKey.isActive }).subscribe({
      next: (updated) => {
        this.apiKeys.update(keys => keys.map(k => k.id === updated.id ? updated : k));
      },
      error: () => this.error.set('Failed to update API key status.')
    });
  }

  deleteKey(id: number): void {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
    this.apiKeyService.delete(id).subscribe({
      next: () => this.apiKeys.update(keys => keys.filter(k => k.id !== id)),
      error: () => this.error.set('Failed to delete API key.')
    });
  }
}
