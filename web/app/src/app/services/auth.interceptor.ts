import { HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;

  if (token && !req.headers.has("Authorization")) {
    req = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    });
  }

  return next(req);
};
