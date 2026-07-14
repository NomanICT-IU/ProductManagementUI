import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ProductService } from '../../../services/product-service';
import { AddProductModel } from '../../../models/add-product-model';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-add.html',
  styleUrl: './product-add.scss',
})
export class ProductAdd {
  productForm: FormGroup;
  isSubmitting = false;

  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(1)]],
      quantity: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
    });
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

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.showAlert('Please fill in all required fields correctly.', 'warning');
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const newProduct: AddProductModel = this.productForm.value;

    this.productService.addProduct(newProduct).subscribe({
      next: (response) => {
        this.showAlert('Product added successfully!', 'success');
        this.isSubmitting = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/user/products']);
        }, 1000);
      },
      error: (err) => {
        console.error('Error adding product:', err);
        const errorMsg = err.error?.message || 'Something went wrong while adding the product.';

        this.showAlert(errorMsg, 'danger');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}
