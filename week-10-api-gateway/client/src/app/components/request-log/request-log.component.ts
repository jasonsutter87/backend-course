import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequestLogService } from '../../services/request-log.service';
import { ApiKeyService } from '../../services/api-key.service';
import { RequestLog } from '../../models/request-log.model';
import { ApiKey } from '../../models/api-key.model';

@Component({
  selector: 'app-request-log',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './request-log.component.html',
  styleUrl: './request-log.component.css'
})
export class RequestLogComponent implements OnInit {
  logs = signal<RequestLog[]>([]);
  apiKey = signal<ApiKey | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  methodFilter = signal<string>('ALL');
  statusFilter = signal<string>('ALL');

  filteredLogs = computed(() => {
    let result = this.logs();
    if (this.methodFilter() !== 'ALL') {
      result = result.filter(l => l.method === this.methodFilter());
    }
    if (this.statusFilter() !== 'ALL') {
      const range = this.statusFilter();
      result = result.filter(l => {
        if (range === '2xx') return l.statusCode >= 200 && l.statusCode < 300;
        if (range === '4xx') return l.statusCode >= 400 && l.statusCode < 500;
        if (range === '5xx') return l.statusCode >= 500;
        return true;
      });
    }
    return result;
  });

  apiKeyId!: number;

  constructor(
    private route: ActivatedRoute,
    private requestLogService: RequestLogService,
    private apiKeyService: ApiKeyService
  ) {}

  ngOnInit(): void {
    this.apiKeyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApiKey();
    this.loadLogs();
  }

  loadApiKey(): void {
    this.apiKeyService.getById(this.apiKeyId).subscribe({
      next: (key) => this.apiKey.set(key),
      error: () => {}
    });
  }

  loadLogs(): void {
    this.loading.set(true);
    this.requestLogService.getByApiKeyId(this.apiKeyId).subscribe({
      next: (logs) => {
        this.logs.set(logs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load request logs. Make sure the server is running.');
        this.loading.set(false);
      }
    });
  }

  getStatusClass(code: number): string {
    if (code >= 200 && code < 300) return 'status-2xx';
    if (code >= 400 && code < 500) return 'status-4xx';
    if (code >= 500) return 'status-5xx';
    return 'status-other';
  }

  maskKey(key: string): string {
    if (!key || key.length < 8) return '••••••••';
    return key.substring(0, 8) + '••••••••';
  }
}
