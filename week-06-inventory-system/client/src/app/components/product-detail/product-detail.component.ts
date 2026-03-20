import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { Transaction } from '../../models/transaction.model';
import { ProductService } from '../../services/product.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly transactionService = inject(TransactionService);

  product: Product | null = null;
  transactions: Transaction[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.transactionService.getByProductId(id).subscribe({
          next: (transactions) => {
            this.transactions = transactions.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Product not found.';
        this.loading = false;
      }
    });
  }

  isLowStock(): boolean {
    return !!this.product && this.product.stockLevel < this.product.minStockLevel;
  }
}
