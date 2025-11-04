import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { stockMovementsData } from "../../services/api.service";

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
  imports: [CommonModule, MatCardModule],
  templateUrl: "./movements.component.html",
  styleUrls: ["./movements.component.css"]
})
export class MovementsComponent {
  movements = stockMovementsData;

  tipoDescricao(tipo: string): string {
    return TIPO_LABEL[String(tipo)] ?? String(tipo);
  }

  motivoDescricao(motivo: string): string {
    return MOTIVO_LABEL[String(motivo)] ?? String(motivo);
  }

  observacaoDescricao(note?: string | null): string {
    if (!note) {
      return "—";
    }
    if (note.trim().toLowerCase() === "estoque inicial") {
      return "Estoque inicial";
    }
    return note;
  }
}
