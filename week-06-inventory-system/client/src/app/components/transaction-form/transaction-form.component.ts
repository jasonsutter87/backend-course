import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css'
})
export class TransactionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly transactionService = inject(TransactionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  products: Product[] = [];
  submitting = false;
  error = '';
  loading = true;

  ngOnInit(): void {
    const preselectedId = this.route.snapshot.queryParamMap.get('productId');

    this.form = this.fb.group({
      productId: [preselectedId ? Number(preselectedId) : null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      type: ['In', Validators.required]
    });

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';

    const { productId, quantity, type } = this.form.value;
    this.transactionService.create({ productId: Number(productId), quantity: Number(quantity), type }).subscribe({
      next: () => this.router.navigate([Number(productId)]),
      error: () => {
        this.error = 'Failed to log transaction.';
        this.submitting = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  get selectedProduct(): Product | undefined {
    const id = Number(this.form.value.productId);
    return this.products.find(p => p.id === id);
  }
}
