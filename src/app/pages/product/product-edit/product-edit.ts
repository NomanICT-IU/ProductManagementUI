

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ProductService } from '../../../services/product-service';
import { UpdateProductModel } from '../../../models/update-product-model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-edit.html',
   styleUrl: './product-edit.scss',
})

export class ProductEdit implements OnInit {
  productForm: FormGroup;
  productId!: number;
  isLoading = true;       
  isSubmitting = false;    

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(1)]],
      quantity: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
    });
  }

  ngOnInit(): void {
    
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.productId) {
      this.loadProductDetails();
    } else {
      this.showAlert('Invalid Product ID', 'danger');
      this.isLoading = false;
    }
  }

  get f() {
    return this.productForm.controls;
  }

  showAlert(message: string, type: 'success' | 'danger' | 'warning'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.alertMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }

  
  loadProductDetails(): void {
    
    this.productService.getProductById(this.productId).subscribe({
      next: (product: UpdateProductModel) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.showAlert('Failed to load product details.', 'danger');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const updatedProduct:UpdateProductModel = {
      id: this.productId,
      ...this.productForm.value
    };

    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: (response) => {
        this.showAlert('Product updated successfully!', 'success');
        this.isSubmitting = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/user/products']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        const errorMsg = err.error?.message || 'Something went wrong while updating the product.';
        this.showAlert(errorMsg, 'danger');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}