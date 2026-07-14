import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UpdateProductModel } from '../models/update-product-model';
import { ProductDetailsModel } from '../models/product-details-model';
import { ProductResponse } from '../models/page-response-model';
import { AddProductModel } from '../models/add-product-model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'https://localhost:44313/api/Products';

  constructor(private http: HttpClient) {}

  getAllProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = ''
  ): Observable<ProductResponse> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('search', search);

    return this.http.get<ProductResponse>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<ProductDetailsModel> {
    return this.http.get<ProductDetailsModel>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: AddProductModel): Observable<AddProductModel> {
    return this.http.post<AddProductModel>(this.apiUrl, product);
  }

  updateProduct(id: number, product: UpdateProductModel): Observable<UpdateProductModel> {
    return this.http.put<UpdateProductModel>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}