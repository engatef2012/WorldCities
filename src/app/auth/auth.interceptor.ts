import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService:AuthService,private router:Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // get the auth token
      var token=this.authService.getToken();
      if (token) {
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next.handle(req).pipe(catchError(error => {
        // Perform logout on 401 – Unauthorized HTTP response errors
        if (error instanceof HttpErrorResponse && error.status == 401) {
          this.authService.logOut();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      }));
    }
// send the request to the next handler
}
