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
import { ApiService, Category, CategoryPayload } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-categories",
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
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"]
})
export class CategoriesComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  protected auth = inject(AuthService);

  categorias = signal<Category[]>([]);
  carregando = signal(true);
  editandoId = signal<string | null>(null);

  form = this.fb.group({
    id: [null as string | null],
    nome: ["", [Validators.required, Validators.maxLength(120)]],
    descricao: [""]
  });

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.api.getCategories().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
        this.carregando.set(false);
      },
      error: () => {
        this.snackBar.open("Não foi possível carregar as categorias.", "Fechar", { duration: 3000 });
        this.carregando.set(false);
      }
    });
  }

  salvar(): void {
    if (this.form.invalid || !this.auth.loggedIn()) {
      return;
    }

    const payload: CategoryPayload = {
      name: this.form.value.nome ?? "",
      description: this.form.value.descricao ?? undefined
    };

    const id = this.form.value.id;

    if (id) {
      this.api.updateCategory(id, payload).subscribe({
        next: () => this.posAcao("Categoria atualizada com sucesso!"),
        error: () => this.snackBar.open("Não foi possível atualizar a categoria.", "Fechar", { duration: 3000 })
      });
    } else {
      this.api.createCategory(payload).subscribe({
        next: () => this.posAcao("Categoria criada com sucesso!"),
        error: () => this.snackBar.open("Não foi possível criar a categoria.", "Fechar", { duration: 3000 })
      });
    }
  }

  private posAcao(mensagem: string): void {
    this.snackBar.open(mensagem, "Fechar", { duration: 3000 });
    this.form.reset();
    this.editandoId.set(null);
    this.carregar();
  }

  editar(categoria: Category): void {
    if (!this.auth.loggedIn()) {
      return;
    }

    this.form.patchValue({
      id: categoria.id,
      nome: categoria.name,
      descricao: categoria.description ?? ""
    });
    this.editandoId.set(categoria.id);
  }

  cancelarEdicao(): void {
    this.form.reset();
    this.editandoId.set(null);
  }

  excluir(categoria: Category): void {
    if (!this.auth.loggedIn()) {
      return;
    }

    const confirmar = window.confirm(`Deseja realmente excluir a categoria "${categoria.name}"?`);
    if (!confirmar) {
      return;
    }

    this.api.deleteCategory(categoria.id).subscribe({
      next: () => {
        this.snackBar.open("Categoria removida.", "Fechar", { duration: 3000 });
        this.carregar();
      },
      error: () => {
        this.snackBar.open("Não foi possível excluir a categoria.", "Fechar", { duration: 3000 });
      }
    });
  }
}
