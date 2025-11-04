import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { customersData, productsData, salesData } from "../../services/api.service";

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule],
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent {
  vendas = salesData;
  produtos = productsData;
  clientes = customersData;

  colunasItens = ["produto", "quantidade", "preco", "subtotal"];
  totalGeral = this.vendas.reduce((total, venda) => total + venda.totalAmount, 0);
}
