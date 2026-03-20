import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { MonthlyReport, CategoryReport } from '../../models/expense.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  private readonly reportService = inject(ReportService);

  monthly = signal<MonthlyReport | null>(null);
  byCategory = signal<CategoryReport[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth() + 1);

  readonly months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getMonthly(this.selectedYear(), this.selectedMonth()).subscribe({
      next: data => this.monthly.set(data),
      error: () => this.error.set('Failed to load monthly report.')
    });

    this.reportService.getByCategory().subscribe({
      next: data => {
        this.byCategory.set(data.sort((a, b) => b.total - a.total));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load category report.');
        this.loading.set(false);
      }
    });
  }

  monthName(num: number): string {
    return this.months[num - 1] ?? '';
  }

  maxTotal(): number {
    const cats = this.byCategory();
    if (!cats.length) return 1;
    return Math.max(...cats.map(c => c.total));
  }

  barWidth(total: number): number {
    return Math.round((total / this.maxTotal()) * 100);
  }
}
