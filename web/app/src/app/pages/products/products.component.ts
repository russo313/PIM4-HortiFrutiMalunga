import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"]
})
export class ProductsComponent {
  protected api = inject(ApiService);
  protected products$ = this.api.getProducts();
}
