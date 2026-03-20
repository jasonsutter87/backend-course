import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardWidget } from '../../models/dashboard-widget.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  widgets = signal<DashboardWidget[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.dashboardService.getAll().subscribe({
      next: (items) => {
        this.widgets.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load widgets. Make sure the server is running.');
        this.loading.set(false);
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Remove this widget from the dashboard?')) return;
    this.dashboardService.delete(id).subscribe({
      next: () => this.widgets.update(items => items.filter(w => w.id !== id)),
      error: () => this.error.set('Failed to delete widget.')
    });
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Chart':   return '&#128200;';
      case 'Table':   return '&#128202;';
      case 'Counter': return '&#128290;';
      case 'List':    return '&#9776;';
      default:        return '&#11036;';
    }
  }

  getTypeClass(type: string): string {
    return 'widget-type-' + (type || 'default').toLowerCase();
  }
}
