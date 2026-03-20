import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  products: Product[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products. Is the server running?';
        this.loading = false;
      }
    });
  }

  isLowStock(product: Product): boolean {
    return product.stockLevel < product.minStockLevel;
  }

  get lowStockCount(): number {
    return this.products.filter(p => this.isLowStock(p)).length;
  }

  viewProduct(id: number): void {
    this.router.navigate([id]);
  }
}
