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
import { ApiService, Category, CategoryPayload } from "../../services/api.service";

@Component({
  selector: "app-categories",
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
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"]
})
export class CategoriesComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  categorias: Category[] = [];
  loading = false;
  editing: Category | null = null;

  form = this.fb.group({
    name: ["", [Validators.required]],
    description: [""]
  });

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: data => (this.categorias = data),
      error: () => this.snack.open("Não foi possível carregar as categorias.", "Fechar", { duration: 3000 })
    });
  }

  startEdit(category: Category) {
    this.editing = category;
    this.form.patchValue({
      name: category.name,
      description: category.description ?? ""
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

    const payload: CategoryPayload = {
      name: this.form.value.name ?? "",
      description: this.form.value.description ?? null
    };

    this.loading = true;
    let request$: Observable<unknown>;
    if (this.editing) {
      request$ = this.api.updateCategory(this.editing.id, payload);
    } else {
      request$ = this.api.createCategory(payload);
    }

    request$.subscribe({
      next: () => {
        this.snack.open(
          this.editing ? "Categoria atualizada." : "Categoria criada.",
          "Fechar",
          { duration: 3000 }
        );
        this.cancelEdit();
        this.loadCategories();
        this.loading = false;
      },
      error: () => {
        this.snack.open("Falha ao salvar categoria.", "Fechar", { duration: 3000 });
        this.loading = false;
      }
    });
  }

  delete(category: Category) {
    if (!confirm(`Excluir a categoria "${category.name}"?`)) {
      return;
    }

    this.api.deleteCategory(category.id).subscribe({
      next: () => {
        this.snack.open("Categoria excluída.", "Fechar", { duration: 3000 });
        this.loadCategories();
      },
      error: err => {
        const message = err?.error?.message ?? "Não foi possível excluir.";
        this.snack.open(message, "Fechar", { duration: 4000 });
      }
    });
  }
}
