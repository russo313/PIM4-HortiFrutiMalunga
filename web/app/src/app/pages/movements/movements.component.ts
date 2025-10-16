import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService, StockMovement } from "../../services/api.service";

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
  Expiry: "Vencimento",
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
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: "./movements.component.html",
  styleUrls: ["./movements.component.css"]
})
export class MovementsComponent {
  protected api = inject(ApiService);
  protected movements$ = this.api.getMovements();

  tipoDescricao(tipo: StockMovement["type"]): string {
    return TIPO_LABEL[String(tipo)] ?? String(tipo);
  }

  motivoDescricao(motivo: StockMovement["reason"]): string {
    return MOTIVO_LABEL[String(motivo)] ?? String(motivo);
  }

  observacaoDescricao(note?: string | null): string {
    if (!note) {
      return "—";
    }
    if (note.trim().toLowerCase() === "seed initial stock") {
      return "Estoque inicial";
    }
    return note;
  }
}
