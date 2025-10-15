import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ApiService, ValidityAlert } from "../../services/api.service";

@Component({
  selector: "app-alerts",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule],
  templateUrl: "./alerts.component.html",
  styleUrls: ["./alerts.component.css"]
})
export class AlertsComponent {
  private api = inject(ApiService);

  alerts = signal<ValidityAlert[] | null>(null);
  loading = signal(true);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts.set(alerts);
        this.loading.set(false);
      },
      error: () => {
        this.alerts.set([]);
        this.loading.set(false);
      }
    });
  }

  markAsRead(id: string): void {
    this.api.markAlertRead(id).subscribe({
      next: () => this.load()
    });
  }
}
