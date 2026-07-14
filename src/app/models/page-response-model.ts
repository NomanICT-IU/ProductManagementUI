
import { ProductModel } from './product-model';

export interface ProductResponse {
  data: ProductModel[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
