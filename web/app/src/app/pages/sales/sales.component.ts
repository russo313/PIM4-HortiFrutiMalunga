import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  ApiService,
  Sale,
  Customer,
  Product,
  SaleItemRequest,
  SaleRequest
} from "../../services/api.service";

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  vendas: Sale[] = [];
  clientes: Customer[] = [];
  produtos: Product[] = [];
  totalGeral = 0;

  form = this.fb.group({
    customerId: [""],
    paymentMethod: ["Dinheiro", Validators.required],
    items: this.fb.array([this.createItemGroup()])
  });

  colunasItens = ["produto", "quantidade", "preco", "subtotal"];

  constructor() {
    this.loadData();
  }

  get items(): FormArray {
    return this.form.get("items") as FormArray;
  }

  createItemGroup() {
    return this.fb.group({
      productId: ["", Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.001)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem() {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number) {
    if (this.items.length === 1) {
      this.items.at(0).reset({ productId: "", quantity: 1, unitPrice: 0 });
      return;
    }
    this.items.removeAt(index);
  }

  loadData() {
    this.api
      .getSales()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(vendas => {
        this.vendas = vendas;
        this.totalGeral = vendas.reduce((total, venda) => total + venda.totalAmount, 0);
      });

    this.api.getCustomers().subscribe({ next: clientes => (this.clientes = clientes) });
    this.api.getProducts().subscribe({ next: produtos => (this.produtos = produtos) });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const items: SaleItemRequest[] = this.items.controls.map(control => {
      const value = control.value as { productId: string; quantity: number; unitPrice: number };
      return {
        productId: value.productId,
        quantity: Number(value.quantity),
        unitPrice: Number(value.unitPrice)
      };
    });

    const payload: SaleRequest = {
      customerId: this.form.value.customerId || null,
      paymentMethod: this.form.value.paymentMethod ?? "Dinheiro",
      items
    };

    this.api.createSale(payload).subscribe({
      next: () => {
        this.snack.open("Venda registrada.", "Fechar", { duration: 3000 });
        this.form.reset({ paymentMethod: "Dinheiro" });
        this.items.clear();
        this.addItem();
        this.loadData();
      },
      error: err => {
        const message = err?.error?.message ?? "Não foi possível registrar a venda.";
        this.snack.open(message, "Fechar", { duration: 4000 });
      }
    });
  }
}
