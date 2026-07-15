import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService } from '../../../services/product-service';
import { ProductDetailsModel } from '../../../models/product-details-model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  product!: ProductDetailsModel;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      return;
    }
    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.product = response;
        this.isLoading = false;
        
        // অ্যাঙ্গুলারকে জোরপূর্বক বলা যে ডাটা চেঞ্জ হয়েছে, ভিউ আপডেট করো
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}