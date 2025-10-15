import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService } from "../../services/api.service";

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
}
