import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import {
  ApiService,
  SALE_TYPE_LABELS,
  Product,
  ProductPayload,
  Category
} from "../../services/api.service";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  saleTypeLabel = SALE_TYPE_LABELS;
  produtos: Product[] = [];
  categorias: Category[] = [];
  editing: Product | null = null;
  loading = false;

  form = this.fb.group({
    name: ["", Validators.required],
    categoryId: ["", Validators.required],
    saleType: ["Unit", Validators.required],
    unitOfMeasure: ["un", Validators.required],
    minimumStock: this.fb.control<number | null>(null),
    expirationDate: this.fb.control<string | null>(null),
    barcode: this.fb.control<string | null>(null),
    active: [true],
    highlights: [""]
  });

  readonly saleTypes = [
    { value: "Unit", label: "Unidade" },
    { value: "Weight", label: "Peso" }
  ];

  constructor() {
    this.loadData();
  }

  loadData() {
    this.api.getProducts().subscribe({ next: d => (this.produtos = d) });
    this.api.getCategories().subscribe({ next: d => (this.categorias = d) });
  }

  startEdit(produto: Product) {
    this.editing = produto;
    this.form.patchValue({
      name: produto.name,
      categoryId: produto.categoryId,
      saleType: produto.saleType,
      unitOfMeasure: produto.unitOfMeasure,
      minimumStock: produto.minimumStock ?? null,
      expirationDate: produto.expirationDate ?? null,
      barcode: produto.barcode ?? null,
      active: produto.active,
      highlights: produto.highlights?.join(", ") ?? ""
    });
  }

  cancelEdit() {
    this.editing = null;
    this.form.reset({ saleType: "Unit", unitOfMeasure: "un", active: true });
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ProductPayload = {
      name: this.form.value.name ?? "",
      categoryId: this.form.value.categoryId ?? "",
      saleType: this.form.value.saleType ?? "Unit",
      unitOfMeasure: this.form.value.unitOfMeasure ?? "un",
      minimumStock: this.form.value.minimumStock ?? null,
      expirationDate: this.form.value.expirationDate || null,
      barcode: this.form.value.barcode || null,
      active: !!this.form.value.active,
      highlights: this.form.value.highlights
        ? this.form.value.highlights.split(",").map(h => h.trim()).filter(Boolean)
        : null
    };

    this.loading = true;
    let request$: Observable<unknown>;
    if (this.editing) {
      request$ = this.api.updateProduct(this.editing.id, payload);
    } else {
      request$ = this.api.createProduct(payload);
    }

    request$.subscribe({
      next: () => {
        this.snack.open(
          this.editing ? "Produto atualizado." : "Produto criado.",
          "Fechar",
          { duration: 3000 }
        );
        this.cancelEdit();
        this.loadData();
        this.loading = false;
      },
      error: () => {
        this.snack.open("Falha ao salvar produto.", "Fechar", { duration: 3000 });
        this.loading = false;
      }
    });
  }

  delete(produto: Product) {
    if (!confirm(`Excluir o produto "${produto.name}"?`)) {
      return;
    }

    this.api.deleteProduct(produto.id).subscribe({
      next: () => {
        this.snack.open("Produto excluído.", "Fechar", { duration: 3000 });
        this.loadData();
      },
      error: () => this.snack.open("Não foi possível excluir.", "Fechar", { duration: 3000 })
    });
  }
}
