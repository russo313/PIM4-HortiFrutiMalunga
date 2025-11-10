import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  feedback: { type: "success" | "error"; message: string } | null = null;

  form = this.fb.group({
    email: ["admin@hortifruti.local", [Validators.required, Validators.email]],
    password: ["Admin@123", [Validators.required]]
  });

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.feedback = null;
    this.auth.login(this.form.value as { email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        this.feedback = {
          type: "success",
          message: "Login realizado com sucesso. Redirecionando..."
        };
        setTimeout(() => this.router.navigateByUrl("/"), 500);
      },
      error: err => {
        this.loading = false;
        const message = err?.error?.message ?? "Não foi possível autenticar. Verifique as credenciais.";
        this.feedback = { type: "error", message };
      }
    });
  }

  logout() {
    this.auth.logout();
    this.feedback = { type: "success", message: "Sessão encerrada." };
  }
}
