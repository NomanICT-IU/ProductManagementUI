import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Subject, Subscription } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProductService } from '../../../services/product-service';
import { ProductModel } from '../../../models/product-model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit, OnDestroy {

  products: ProductModel[] = [];

  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;
  totalRecords = 0;

  // Loading State
  isLoading = false;

  // Search Text
  searchText = '';

  // Subject for Debounce
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription; 

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadProducts();
      });
  }

  loadProducts() {
    this.isLoading = true;
    this.cdr.detectChanges(); 

    this.productService
      .getAllProducts(
        this.pageNumber,
        this.pageSize,
        this.searchText
      )
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.products = response.data;
          this.totalPages = response.totalPages;
          this.totalRecords = response.totalRecords;
          
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

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadProducts();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadProducts();
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}