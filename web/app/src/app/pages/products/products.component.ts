import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService, Product, ProductPayload, Category } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-products",
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
    MatSlideToggleModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  protected auth = inject(AuthService);

  produtos = signal<Product[]>([]);
  categorias = signal<Category[]>([]);
  carregando = signal(true);
  editandoId = signal<string | null>(null);

  saleTypes = [
    { valor: "Unit", descricao: "UNIDADE" },
    { valor: "Weight", descricao: "PESO" }
  ];

  form = this.fb.group({
    id: [null as string | null],
    nome: ["", [Validators.required, Validators.maxLength(160)]],
    categoriaId: ["", Validators.required],
    tipoVenda: ["Unit", Validators.required],
    unidadeMedida: ["un", Validators.required],
    estoqueMinimo: [0],
    validade: [""],
    codigoBarras: [""],
    ativo: [true]
  });

  constructor() {
    this.carregar();
    this.carregarCategorias();
  }

  carregar(): void {
    this.carregando.set(true);
    this.api.getProducts().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open("Não foi possível carregar os produtos.", "Fechar", {
          duration: 3000
        });
        this.carregando.set(false);
      }
    });
  }

  carregarCategorias(): void {
    this.api.getCategories().subscribe((categorias) => this.categorias.set(categorias));
  }

  salvar(): void {
    if (this.form.invalid || !this.auth.loggedIn()) {
      return;
    }

    const payload: ProductPayload = {
      name: this.form.value.nome ?? "",
      categoryId: this.form.value.categoriaId ?? "",
      saleType: this.form.value.tipoVenda ?? "Unit",
      unitOfMeasure: this.form.value.unidadeMedida ?? "un",
      minimumStock: this.form.value.estoqueMinimo !== null ? Number(this.form.value.estoqueMinimo) : null,
      expirationDate: this.form.value.validade || null,
      barcode: this.form.value.codigoBarras || null,
      active: !!this.form.value.ativo
    };

    const id = this.form.value.id;

    if (id) {
      this.api.updateProduct(id, payload).subscribe({
        next: () => this.posAcao("Produto atualizado com sucesso!"),
        error: () => this.snackBar.open("Não foi possível atualizar o produto.", "Fechar", { duration: 4000 })
      });
    } else {
      this.api.createProduct(payload).subscribe({
        next: () => this.posAcao("Produto criado com sucesso!"),
        error: () => this.snackBar.open("Não foi possível criar o produto.", "Fechar", { duration: 4000 })
      });
    }
  }

  private posAcao(mensagem: string): void {
    this.snackBar.open(mensagem, "Fechar", { duration: 3000 });
    this.form.reset({ ativo: true, tipoVenda: "Unit", unidadeMedida: "un", estoqueMinimo: 0 });
    this.editandoId.set(null);
    this.carregar();
  }

  editar(produto: Product): void {
    if (!this.auth.loggedIn()) {
      return;
    }

    this.form.patchValue({
      id: produto.id,
      nome: produto.name,
      categoriaId: produto.categoryId,
      tipoVenda: produto.saleType,
      unidadeMedida: produto.unitOfMeasure,
      estoqueMinimo: produto.minimumStock ?? 0,
      validade: produto.expirationDate ?? "",
      codigoBarras: produto.barcode ?? "",
      ativo: produto.active
    });
    this.editandoId.set(produto.id);
  }

  cancelarEdicao(): void {
    this.form.reset({ ativo: true, tipoVenda: "Unit", unidadeMedida: "un", estoqueMinimo: 0 });
    this.editandoId.set(null);
  }

  excluir(produto: Product): void {
    if (!this.auth.loggedIn()) {
      return;
    }
    const confirmar = window.confirm(`Deseja realmente excluir o produto "${produto.name}"?`);
    if (!confirmar) {
      return;
    }

    this.api.deleteProduct(produto.id).subscribe({
      next: () => {
        this.snackBar.open("Produto removido.", "Fechar", { duration: 3000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open("Não foi possível remover o produto.", "Fechar", { duration: 4000 });
      }
    });
  }
}
