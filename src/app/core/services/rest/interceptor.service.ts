import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headersNew = new HttpHeaders();
    let authorizedRequest: HttpRequest<any> = req.clone();

    headersNew = headersNew.append('LicenseName', 'SNAC');

    if (!this.auth.isAuthenticated()) {
      if (this.router.url !== '/' && this.router.url !== '/download-report' && !this.router.url.includes('login')) {
        this.router.navigate(['/login']);
      }
    }

    if (!req.url.includes('apimarketplace') && !req.url.includes('googleapis')) {
      authorizedRequest = req.clone({
        headers: headersNew.append('Authorization', `Bearer ${localStorage.getItem('token') ?? ''}`),
      });
    }

    return next.handle(authorizedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        return throwError(error);
      })
    );

  }

}
