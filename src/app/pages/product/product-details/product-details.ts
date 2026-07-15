import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 

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
  
 
  selectedProductId!: number;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
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
        
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  openDeleteModal(id: number): void {
    this.selectedProductId = id;
  }

  confirmDelete(): void {
    if (!this.selectedProductId) return;

    this.isDeleting = true;
    this.cdr.detectChanges();

    this.productService.deleteProduct(this.selectedProductId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.cdr.detectChanges();
        this.router.navigate(['/user/products']);
      },
      error: (err) => {
        console.error('Delete Error:', err);
        this.isDeleting = false;
        this.cdr.detectChanges();
        alert('Failed to delete the product. Please try again.');
      }
    });
  }
}