import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService, Sale } from "../../services/api.service";

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent {
  private api = inject(ApiService);
  sales$ = this.api.getSales();

  trackBySale(index: number, sale: Sale): string {
    return sale.id;
  }
}
