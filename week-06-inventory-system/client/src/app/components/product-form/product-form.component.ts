import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  submitting = false;
  error = '';
  loading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      sku: ['', [Validators.required, Validators.minLength(2)]],
      stockLevel: [0, [Validators.required, Validators.min(0)]],
      minStockLevel: [0, [Validators.required, Validators.min(0)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      this.loading = true;
      this.productService.getById(this.productId).subscribe({
        next: (product) => {
          this.form.patchValue(product);
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not load product for editing.';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';

    if (this.isEditMode && this.productId !== null) {
      const updated: Product = { id: this.productId, ...this.form.value };
      this.productService.update(this.productId, updated).subscribe({
        next: () => this.router.navigate([this.productId]),
        error: () => {
          this.error = 'Failed to update product.';
          this.submitting = false;
        }
      });
    } else {
      this.productService.create(this.form.value).subscribe({
        next: (created) => this.router.navigate([created.id]),
        error: () => {
          this.error = 'Failed to create product.';
          this.submitting = false;
        }
      });
    }
  }

  get f() {
    return this.form.controls;
  }
}
