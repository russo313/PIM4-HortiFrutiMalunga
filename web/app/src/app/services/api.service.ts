import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  saleType: string;
  unitOfMeasure: string;
  expirationDate?: string;
  barcode?: string;
  active: boolean;
  minimumStock?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: string;
  reason: string;
  quantity: number;
  timestamp: string;
  note?: string;
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

export interface Sale {
  id: string;
  customerId?: string;
  date: string;
  totalAmount: number;
  items: SaleItem[];
}

export interface CategoryPayload {
  name: string;
  description?: string | null;
}

export interface ProductPayload {
  name: string;
  categoryId: string;
  saleType: string;
  unitOfMeasure: string;
  expirationDate?: string | null;
  barcode?: string | null;
  active: boolean;
  minimumStock?: number | null;
}

export interface CustomerPayload {
  name: string;
  phone?: string | null;
  email?: string | null;
}

export interface SaleItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface SaleRequest {
  customerId?: string | null;
  items: SaleItemRequest[];
}

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  createCategory(payload: CategoryPayload) {
    return this.http.post<Category>(`${this.baseUrl}/categories`, payload);
  }

  updateCategory(id: string, payload: CategoryPayload) {
    return this.http.put<void>(`${this.baseUrl}/categories/${id}`, payload);
  }

  deleteCategory(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  createProduct(payload: ProductPayload) {
    return this.http.post<Product>(`${this.baseUrl}/products`, payload);
  }

  updateProduct(id: string, payload: ProductPayload) {
    return this.http.put<void>(`${this.baseUrl}/products/${id}`, payload);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
  }

  createCustomer(payload: CustomerPayload) {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, payload);
  }

  updateCustomer(id: string, payload: CustomerPayload) {
    return this.http.put<void>(`${this.baseUrl}/customers/${id}`, payload);
  }

  deleteCustomer(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/customers/${id}`);
  }

  getMovements(): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.baseUrl}/stock/movements`);
  }

  getBalance(productId: string) {
    return this.http.get<{ productId: string; balance: number }>(
      `${this.baseUrl}/stock/balance/${productId}`
    );
  }

  getAlerts(): Observable<ValidityAlert[]> {
    return this.http.get<ValidityAlert[]>(`${this.baseUrl}/validity/alerts`);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/sales`);
  }

  createSale(payload: SaleRequest) {
    return this.http.post<Sale>(`${this.baseUrl}/sales`, payload);
  }

  getUpcoming(days: number): Observable<ValidityAlert[]> {
    return this.http.get<ValidityAlert[]>(`${this.baseUrl}/validity/next`, {
      params: { days }
    });
  }

  markAlertRead(id: string) {
    return this.http.patch(`${this.baseUrl}/validity/alerts/${id}/read`, {});
  }
}
