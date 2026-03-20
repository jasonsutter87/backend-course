import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { Expense, Category } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent implements OnInit {
  private readonly expenseService = inject(ExpenseService);
  private readonly categoryService = inject(CategoryService);

  expenses = signal<Expense[]>([]);
  categories = signal<Category[]>([]);
  selectedCategoryId = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  total = computed(() =>
    this.expenses().reduce((sum, e) => sum + e.amount, 0)
  );

  ngOnInit(): void {
    this.loadCategories();
    this.loadExpenses();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: cats => this.categories.set(cats),
      error: () => this.error.set('Failed to load categories.')
    });
  }

  loadExpenses(): void {
    this.loading.set(true);
    this.error.set(null);
    const catId = this.selectedCategoryId() ?? undefined;
    this.expenseService.getAll(catId).subscribe({
      next: data => {
        this.expenses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load expenses.');
        this.loading.set(false);
      }
    });
  }

  onCategoryChange(value: string): void {
    this.selectedCategoryId.set(value ? +value : null);
    this.loadExpenses();
  }

  deleteExpense(id: number): void {
    if (!confirm('Delete this expense?')) return;
    this.expenseService.delete(id).subscribe({
      next: () => this.expenses.update(list => list.filter(e => e.id !== id)),
      error: () => this.error.set('Failed to delete expense.')
    });
  }

  categoryName(id: number): string {
    return this.categories().find(c => c.id === id)?.name ?? '—';
  }
}
