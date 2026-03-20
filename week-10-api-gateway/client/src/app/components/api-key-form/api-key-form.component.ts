import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiKeyService } from '../../services/api-key.service';

@Component({
  selector: 'app-api-key-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './api-key-form.component.html',
  styleUrl: './api-key-form.component.css'
})
export class ApiKeyFormComponent {
  name = signal('');
  rateLimit = signal(100);
  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(private apiKeyService: ApiKeyService, private router: Router) {}

  onSubmit(): void {
    if (!this.name().trim()) {
      this.error.set('Key name is required.');
      return;
    }
    if (this.rateLimit() < 1) {
      this.error.set('Rate limit must be at least 1 request per minute.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.apiKeyService.create({ name: this.name().trim(), rateLimit: this.rateLimit() }).subscribe({
      next: (key) => {
        this.submitting.set(false);
        this.success.set(`API key "${key.name || this.name()}" created successfully!`);
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Failed to create API key. Make sure the server is running.');
      }
    });
  }
}
