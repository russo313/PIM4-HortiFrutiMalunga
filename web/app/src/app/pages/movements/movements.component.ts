import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ApiService, ManualDecreasePayload, MovementReason, StockMovement, Product } from "../../services/api.service";

const TIPO_LABEL: Record<string, string> = {
  Entry: "Entrada",
  Exit: "Saída",
  Adjustment: "Ajuste",
  "0": "Entrada",
  "1": "Saída",
  "2": "Ajuste"
};

const MOTIVO_LABEL: Record<string, string> = {
  Sale: "Venda",
  Donation: "Doação",
  Loss: "Perda",
  Expiration: "Vencimento",
  Others: "Outros",
  "1": "Venda",
  "2": "Doação",
  "3": "Perda",
  "4": "Vencimento",
  "9": "Outros"
};

@Component({
  selector: "app-movements",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: "./movements.component.html",
  styleUrls: ["./movements.component.css"]
})
export class MovementsComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly snack = inject(MatSnackBar);

  movements: StockMovement[] = [];
  products: Product[] = [];

  form = this.fb.group({
    productId: ["", Validators.required],
    quantity: [1, [Validators.required, Validators.min(0.001)]],
    reason: ["Sale" as MovementReason, Validators.required],
    note: [""]
  });

  reasons = [
    { value: "Sale", label: "Venda" },
    { value: "Donation", label: "Doação" },
    { value: "Loss", label: "Perda" },
    { value: "Expiration", label: "Vencimento" },
    { value: "Others", label: "Outros" }
  ];

  constructor() {
    this.loadData();
  }

  loadData() {
    this.api.getStockMovements().subscribe({ next: data => (this.movements = data) });
    this.api.getProducts().subscribe({ next: data => (this.products = data) });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ManualDecreasePayload = {
      productId: this.form.value.productId ?? "",
      quantity: Number(this.form.value.quantity),
      reason: this.form.value.reason ?? "Sale",
      note: this.form.value.note || null
    };

    this.api.createManualDecrease(payload).subscribe({
      next: () => {
        this.snack.open("Movimentação registrada.", "Fechar", { duration: 3000 });
        this.form.reset({ quantity: 1, reason: "Sale" });
        this.loadData();
      },
      error: err => {
        const message = err?.error?.message ?? "Não foi possível registrar.";
        this.snack.open(message, "Fechar", { duration: 4000 });
      }
    });
  }

  tipoDescricao(tipo: StockMovement["type"]): string {
    return TIPO_LABEL[String(tipo)] ?? String(tipo);
  }

  motivoDescricao(motivo: StockMovement["reason"]): string {
    return MOTIVO_LABEL[String(motivo)] ?? String(motivo);
  }

  observacaoDescricao(note?: string | null): string {
    if (!note) {
      return "-";
    }
    if (note.trim().toLowerCase() === "estoque inicial") {
      return "Estoque inicial";
    }
    return note;
  }
}
