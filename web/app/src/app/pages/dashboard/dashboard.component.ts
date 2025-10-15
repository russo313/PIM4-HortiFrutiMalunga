import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent {
  private api = inject(ApiService);

  categories$ = this.api.getCategories();
  products$ = this.api.getProducts();
  customers$ = this.api.getCustomers();
  alerts$ = this.api.getAlerts();
  sales$ = this.api.getSales();
}
