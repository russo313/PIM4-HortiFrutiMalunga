import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { combineLatest, map } from "rxjs";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent {
  private readonly api = inject(ApiService);

  cards$ = combineLatest({
    categories: this.api.getCategories(),
    products: this.api.getProducts(),
    customers: this.api.getCustomers(),
    alerts: this.api.getValidityAlerts(),
    sales: this.api.getSales()
  }).pipe(
    map(({ categories, products, customers, alerts, sales }) => {
      const faturamento = sales.reduce((total, venda) => total + venda.totalAmount, 0);
      return [
        { title: "Categorias", value: categories.length, description: "Segmentos cadastrados" },
        { title: "Produtos ativos", value: products.length, description: "Itens disponiveis no catalogo" },
        { title: "Clientes", value: customers.length, description: "Contatos ilustrativos" },
        { title: "Alertas de validade", value: alerts.length, description: "Produtos que exigem atencao" },
        { title: "Pedidos registrados", value: sales.length, description: "Vendas simuladas no periodo" },
        { title: "Faturamento estimado", value: faturamento, description: "Somatorio das vendas (R$)" }
      ];
    })
  );
}
