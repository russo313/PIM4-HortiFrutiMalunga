import { inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap } from "rxjs";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  name: string;
  role: string;
  token: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);

  private readonly tokenKey = "hortifruti_token";
  private readonly nameKey = "hortifruti_usuario";

  loggedIn = signal<boolean>(!!localStorage.getItem(this.tokenKey));
  userName = signal<string | null>(localStorage.getItem(this.nameKey));

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.nameKey, response.name);
          this.loggedIn.set(true);
          this.userName.set(response.name);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.nameKey);
    this.loggedIn.set(false);
    this.userName.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}

