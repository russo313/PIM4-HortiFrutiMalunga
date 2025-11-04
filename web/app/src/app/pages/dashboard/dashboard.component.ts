import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { categoriesData, customersData, productsData, salesData, validityAlertsData } from "../../services/api.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent {
  cards = [
    { title: "Categorias", value: categoriesData.length, description: "Segmentos cadastrados" },
    { title: "Produtos ativos", value: productsData.length, description: "Itens disponíveis no catálogo" },
    { title: "Clientes", value: customersData.length, description: "Contatos ilustrativos" },
    { title: "Alertas de validade", value: validityAlertsData.length, description: "Produtos que exigem atenção" },
    { title: "Pedidos registrados", value: salesData.length, description: "Vendas simuladas no período" },
    {
      title: "Faturamento estimado",
      value: salesData.reduce((total, venda) => total + venda.totalAmount, 0),
      description: "Somatório das vendas (R$)"
    }
  ];
}
