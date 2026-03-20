import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-widget-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './widget-form.component.html',
  styleUrl: './widget-form.component.css'
})
export class WidgetFormComponent implements OnInit {
  isEditMode = signal(false);
  widgetId = signal<number | null>(null);

  title = signal('');
  type = signal('Chart');
  dataSource = signal('');
  config = signal('{}');

  submitting = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  widgetTypes = ['Chart', 'Table', 'Counter', 'List'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.widgetId.set(Number(id));
      this.loadWidget(Number(id));
    }
  }

  loadWidget(id: number): void {
    this.dashboardService.getById(id).subscribe({
      next: (w) => {
        this.title.set(w.title);
        this.type.set(w.type);
        this.dataSource.set(w.dataSource);
        this.config.set(w.config || '{}');
      },
      error: () => this.error.set('Failed to load widget data.')
    });
  }

  isValidJson(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  onSubmit(): void {
    if (!this.title().trim()) {
      this.error.set('Widget title is required.');
      return;
    }
    if (this.config() && !this.isValidJson(this.config())) {
      this.error.set('Config must be valid JSON.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const dto = {
      title: this.title().trim(),
      type: this.type(),
      dataSource: this.dataSource().trim(),
      config: this.config().trim() || '{}'
    };

    const request$ = this.isEditMode() && this.widgetId()
      ? this.dashboardService.update(this.widgetId()!, dto)
      : this.dashboardService.create(dto);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.set(this.isEditMode() ? 'Widget updated!' : 'Widget created!');
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Failed to save widget. Make sure the server is running.');
      }
    });
  }
}
