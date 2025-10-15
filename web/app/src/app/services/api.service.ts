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

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
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

  getUpcoming(days: number): Observable<ValidityAlert[]> {
    return this.http.get<ValidityAlert[]>(`${this.baseUrl}/validity/next`, {
      params: { days }
    });
  }

  markAlertRead(id: string) {
    return this.http.patch(`${this.baseUrl}/validity/alerts/${id}/read`, {});
  }
}
