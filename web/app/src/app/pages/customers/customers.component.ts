import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService, Customer, CustomerPayload } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-customers",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.css"]
})
export class CustomersComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  protected auth = inject(AuthService);

  clientes = signal<Customer[]>([]);
  carregando = signal(true);
  editandoId = signal<string | null>(null);

  form = this.fb.group({
    id: [null as string | null],
    nome: ["", [Validators.required, Validators.maxLength(150)]],
    telefone: [""],
    email: ["", Validators.email]
  });

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.api.getCustomers().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open("Não foi possível carregar os clientes.", "Fechar", { duration: 3000 });
        this.carregando.set(false);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid || !this.auth.loggedIn()) {
      return;
    }

    const payload: CustomerPayload = {
      name: this.form.value.nome ?? "",
      phone: this.form.value.telefone || null,
      email: this.form.value.email || null
    };

    const id = this.form.value.id;

    if (id) {
      this.api.updateCustomer(id, payload).subscribe({
        next: () => this.posAcao("Cliente atualizado com sucesso!"),
        error: () => this.snackBar.open("Não foi possível atualizar o cliente.", "Fechar", { duration: 3000 })
      });
    } else {
      this.api.createCustomer(payload).subscribe({
        next: () => this.posAcao("Cliente criado com sucesso!"),
        error: () => this.snackBar.open("Não foi possível criar o cliente.", "Fechar", { duration: 3000 })
      });
    }
  }

  private posAcao(mensagem: string): void {
    this.snackBar.open(mensagem, "Fechar", { duration: 3000 });
    this.form.reset();
    this.editandoId.set(null);
    this.carregar();
  }

  editar(cliente: Customer): void {
    if (!this.auth.loggedIn()) {
      return;
    }

    this.form.patchValue({
      id: cliente.id,
      nome: cliente.name,
      telefone: cliente.phone ?? "",
      email: cliente.email ?? ""
    });
    this.editandoId.set(cliente.id);
  }

  cancelarEdicao(): void {
    this.form.reset();
    this.editandoId.set(null);
  }

  excluir(cliente: Customer): void {
    if (!this.auth.loggedIn()) {
      return;
    }

    const confirmar = window.confirm(`Deseja remover o cliente "${cliente.name}"?`);
    if (!confirmar) {
      return;
    }

    this.api.deleteCustomer(cliente.id).subscribe({
      next: () => {
        this.snackBar.open("Cliente removido.", "Fechar", { duration: 3000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open("Não foi possível remover o cliente.", "Fechar", { duration: 3000 });
      }
    });
  }
}
