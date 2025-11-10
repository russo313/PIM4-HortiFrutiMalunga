import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
}

export type SaleType = "Unit" | "Weight" | string;

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  saleType: SaleType;
  unitOfMeasure: string;
  expirationDate?: string | null;
  barcode?: string | null;
  active: boolean;
  minimumStock?: number | null;
  highlights?: string[] | null;
}

export interface ProductPayload {
  name: string;
  categoryId: string;
  saleType: SaleType;
  unitOfMeasure: string;
  expirationDate?: string | null;
  barcode?: string | null;
  active: boolean;
  minimumStock?: number | null;
  highlights?: string[] | null;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  favoriteProducts?: string[] | null;
}

export interface CustomerPayload {
  name: string;
  phone?: string | null;
  email?: string | null;
  favoriteProducts?: string[] | null;
}

export type MovementType = "Entry" | "Exit" | "Adjustment" | number;
export type MovementReason = "Sale" | "Donation" | "Loss" | "Expiration" | "Others" | number;

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  timestamp: string;
  userId: string;
  note?: string | null;
}

export interface ValidityAlert {
  id: string;
  productId: string;
  productName: string;
  validUntil: string;
  daysRemaining: number;
  status: string;
  generatedAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ManualDecreasePayload {
  productId: string;
  quantity: number;
  reason: MovementReason;
  note?: string | null;
}

export interface Sale {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  items: SaleItem[];
}

export interface SaleItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface SaleRequest {
  customerId?: string | null;
  paymentMethod: string;
  items: SaleItemRequest[];
}

export const SALE_TYPE_LABELS: Record<string, string> = {
  Unit: "Unidade",
  Weight: "Peso"
};

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, "");

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.buildUrl("/categories"));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.buildUrl("/products"));
  }

  createProduct(payload: ProductPayload) {
    return this.http.post<Product>(this.buildUrl("/products"), payload);
  }

  updateProduct(id: string, payload: ProductPayload) {
    return this.http.put<void>(this.buildUrl(`/products/${id}`), payload);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(this.buildUrl(`/products/${id}`));
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.buildUrl("/customers"));
  }

  createCustomer(payload: CustomerPayload) {
    return this.http.post<Customer>(this.buildUrl("/customers"), payload);
  }

  updateCustomer(id: string, payload: CustomerPayload) {
    return this.http.put<void>(this.buildUrl(`/customers/${id}`), payload);
  }

  deleteCustomer(id: string) {
    return this.http.delete<void>(this.buildUrl(`/customers/${id}`));
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.buildUrl("/sales"));
  }

  createSale(payload: SaleRequest) {
    return this.http.post<Sale>(this.buildUrl("/sales"), payload);
  }

  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(this.buildUrl("/stock/movements"));
  }

  createManualDecrease(payload: ManualDecreasePayload) {
    return this.http.post<StockMovement>(this.buildUrl("/stock/manual-decrease"), payload);
  }

  getValidityAlerts(): Observable<ValidityAlert[]> {
    return this.http.get<ValidityAlert[]>(this.buildUrl("/validity/alerts"));
  }

  createCategory(payload: CategoryPayload) {
    return this.http.post<Category>(this.buildUrl("/categories"), payload);
  }

  updateCategory(id: string, payload: CategoryPayload) {
    return this.http.put<void>(this.buildUrl(`/categories/${id}`), payload);
  }

  deleteCategory(id: string) {
    return this.http.delete<void>(this.buildUrl(`/categories/${id}`));
  }
}
