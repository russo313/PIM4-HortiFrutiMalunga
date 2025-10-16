import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  carregando = false;

  form = this.fb.nonNullable.group({
    email: ["admin@hortifruti.local", [Validators.required, Validators.email]],
    senha: ["Admin@123", [Validators.required]]
  });

  entrar(): void {
    if (this.form.invalid || this.carregando) {
      return;
    }
    this.carregando = true;

    this.auth
      .login({
        email: this.form.value.email ?? "",
        password: this.form.value.senha ?? ""
      })
      .subscribe({
        next: () => {
          this.carregando = false;
          this.snackBar.open("Login realizado com sucesso!", "Fechar", {
            duration: 3000
          });
          this.router.navigateByUrl("/");
        },
        error: () => {
          this.carregando = false;
          this.snackBar.open("Não foi possível entrar. Verifique as credenciais.", "Fechar", {
            duration: 4000
          });
        }
      });
  }
}
