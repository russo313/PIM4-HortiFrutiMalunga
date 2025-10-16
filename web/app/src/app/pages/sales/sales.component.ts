import { Component, inject, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService, Sale, SaleRequest, SaleItemRequest, Product, Customer } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  protected auth = inject(AuthService);

  vendas = signal<Sale[]>([]);
  produtos = signal<Product[]>([]);
  clientes = signal<Customer[]>([]);
  carregando = signal(true);

  itens = signal<SaleItemRequest[]>([]);

  resumoTotal = computed(() =>
    this.itens().reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  );

  nomeProduto(id: string): string {
    return this.produtos().find((p) => p.id === id)?.name ?? "—";
  }

  cabecalhoForm = this.fb.group({
    clienteId: ["" as string | null]
  });

  itemForm = this.fb.group({
    produtoId: ["", Validators.required],
    quantidade: [1, [Validators.required, Validators.min(0.001)]],
    precoUnitario: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    this.carregarVendas();
    this.carregarProdutos();
    this.carregarClientes();
  }

  carregarVendas(): void {
    this.carregando.set(true);
    this.api.getSales().subscribe({
      next: (vendas) => {
        this.vendas.set(vendas);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open("Não foi possível carregar as vendas.", "Fechar", {
          duration: 4000
        });
        this.carregando.set(false);
      }
    });
  }

  carregarProdutos(): void {
    this.api.getProducts().subscribe((produtos) => this.produtos.set(produtos));
  }

  carregarClientes(): void {
    this.api.getCustomers().subscribe((clientes) => this.clientes.set(clientes));
  }

  adicionarItem(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const produto = this.produtos().find((p) => p.id === this.itemForm.value.produtoId);
    if (!produto) {
      this.snackBar.open("Selecione um produto válido.", "Fechar", {
        duration: 3000
      });
      return;
    }

    const novoItem: SaleItemRequest = {
      productId: produto.id,
      quantity: Number(this.itemForm.value.quantidade),
      unitPrice: Number(this.itemForm.value.precoUnitario)
    };

    this.itens.update((itens) => [...itens, novoItem]);
    this.itemForm.reset({ produtoId: "", quantidade: 1, precoUnitario: 0 });
  }

  removerItem(index: number): void {
    this.itens.update((itens) => itens.filter((_, i) => i !== index));
  }

  registrarVenda(): void {
    if (!this.auth.loggedIn()) {
      this.snackBar.open("É necessário estar logado para registrar uma venda.", "Fechar", {
        duration: 3000
      });
      return;
    }

    if (this.itens().length === 0) {
      this.snackBar.open("Adicione pelo menos um item à venda.", "Fechar", {
        duration: 3000
      });
      return;
    }

    const payload: SaleRequest = {
      customerId: this.cabecalhoForm.value.clienteId || null,
      items: this.itens().map((item) => ({ ...item, unitPrice: Number(item.unitPrice) }))
    };

    this.api.createSale(payload).subscribe({
      next: () => {
        this.snackBar.open("Venda registrada com sucesso!", "Fechar", {
          duration: 3000
        });
        this.itens.set([]);
        this.cabecalhoForm.reset();
        this.carregarVendas();
      },
      error: (erro) => {
        const mensagem = erro?.error?.message ?? "Não foi possível registrar a venda.";
        this.snackBar.open(mensagem, "Fechar", {
          duration: 4000
        });
      }
    });
  }
}
