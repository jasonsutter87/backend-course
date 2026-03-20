import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly expenseService = inject(ExpenseService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  isEditMode = signal(false);
  editId = signal<number | null>(null);
  submitting = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.minLength(1)]],
    categoryId: [null as number | null, Validators.required],
    date: ['', Validators.required]
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: cats => this.categories.set(cats),
      error: () => this.error.set('Failed to load categories.')
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId.set(+id);
      this.expenseService.getById(+id).subscribe({
        next: expense => {
          this.form.patchValue({
            amount: expense.amount,
            description: expense.description,
            categoryId: expense.categoryId,
            date: expense.date.split('T')[0]
          });
        },
        error: () => this.error.set('Failed to load expense.')
      });
    } else {
      // Default date to today
      const today = new Date().toISOString().split('T')[0];
      this.form.patchValue({ date: today });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const payload = {
      amount: value.amount!,
      description: value.description!,
      categoryId: +value.categoryId!,
      date: new Date(value.date!).toISOString()
    };

    this.submitting.set(true);
    this.error.set(null);

    const request$ = this.isEditMode()
      ? this.expenseService.update(this.editId()!, payload)
      : this.expenseService.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('Failed to save expense. Please try again.');
        this.submitting.set(false);
      }
    });
  }

  get f() { return this.form.controls; }
}
