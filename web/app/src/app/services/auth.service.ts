import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../environments/environment";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  role: string;
  token: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly tokenKey = "hortifruti_token";
  private readonly userKey = "hortifruti_user";
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, "");

  currentUser = signal<LoginResponse | null>(this.loadUser());

  constructor(private readonly http: HttpClient) {}

  private loadUser(): LoginResponse | null {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    if (!token || !userJson) {
      return null;
    }

    try {
      const user = JSON.parse(userJson) as LoginResponse;
      return { ...user, token };
    } catch {
      this.logout();
      return null;
    }
  }

  login(payload: LoginPayload) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/auth/login`, payload)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(
            this.userKey,
            JSON.stringify({ name: response.name, role: response.role })
          );
          this.currentUser.set(response);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  get token(): string | null {
    return this.currentUser()?.token ?? localStorage.getItem(this.tokenKey);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }
}
