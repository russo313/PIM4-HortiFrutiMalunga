import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { ApiService, Customer, CustomerPayload } from "../../services/api.service";

@Component({
  selector: "app-customers",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.css"]
})
export class CustomersComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  clientes: Customer[] = [];
  editing: Customer | null = null;
  loading = false;

  form = this.fb.group({
    name: ["", Validators.required],
    phone: [""],
    email: ["", Validators.email],
    favoriteProducts: [""]
  });

  constructor() {
    this.load();
  }

  load() {
    this.api.getCustomers().subscribe({ next: data => (this.clientes = data) });
  }

  startEdit(cliente: Customer) {
    this.editing = cliente;
    this.form.patchValue({
      name: cliente.name,
      phone: cliente.phone ?? "",
      email: cliente.email ?? "",
      favoriteProducts: cliente.favoriteProducts?.join(", ") ?? ""
    });
  }

  cancelEdit() {
    this.editing = null;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CustomerPayload = {
      name: this.form.value.name ?? "",
      phone: this.form.value.phone || null,
      email: this.form.value.email || null,
      favoriteProducts: this.form.value.favoriteProducts
        ? this.form.value.favoriteProducts.split(",").map(p => p.trim()).filter(Boolean)
        : null
    };

    this.loading = true;
    let request$: Observable<unknown>;
    if (this.editing) {
      request$ = this.api.updateCustomer(this.editing.id, payload);
    } else {
      request$ = this.api.createCustomer(payload);
    }

    request$.subscribe({
      next: () => {
        this.snack.open(
          this.editing ? "Cliente atualizado." : "Cliente adicionado.",
          "Fechar",
          { duration: 3000 }
        );
        this.cancelEdit();
        this.load();
        this.loading = false;
      },
      error: () => {
        this.snack.open("Falha ao salvar cliente.", "Fechar", { duration: 3000 });
        this.loading = false;
      }
    });
  }

  delete(cliente: Customer) {
    if (!confirm(`Excluir o cliente "${cliente.name}"?`)) {
      return;
    }

    this.api.deleteCustomer(cliente.id).subscribe({
      next: () => {
        this.snack.open("Cliente excluído.", "Fechar", { duration: 3000 });
        this.load();
      },
      error: () => this.snack.open("Não foi possível excluir.", "Fechar", { duration: 3000 })
    });
  }
}
