import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule as NgFormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsSummary, DataPoint } from '../../models/data-point.model';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, RouterLink, NgFormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit {
  summary = signal<AnalyticsSummary | null>(null);
  trendData = signal<DataPoint[]>([]);
  loadingSummary = signal(false);
  loadingTrend = signal(false);
  error = signal<string | null>(null);

  categoryFilter = signal('');
  fromDate = signal('');
  toDate = signal('');

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadTrend();
  }

  loadSummary(): void {
    this.loadingSummary.set(true);
    this.analyticsService.getSummary().subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.error.set('Failed to load analytics summary. Make sure the server is running.');
        this.loadingSummary.set(false);
      }
    });
  }

  loadTrend(): void {
    this.loadingTrend.set(true);
    this.analyticsService.getTrend(
      this.categoryFilter() || undefined,
      this.fromDate() || undefined,
      this.toDate() || undefined
    ).subscribe({
      next: (data) => {
        this.trendData.set(data);
        this.loadingTrend.set(false);
      },
      error: () => {
        this.loadingTrend.set(false);
      }
    });
  }

  applyFilters(): void {
    this.loadTrend();
  }
}
