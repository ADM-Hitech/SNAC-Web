import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

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
      if (this.router.url !== '/' && !this.router.url.includes('login')) {
        this.router.navigate(['/login']);
      }
    }

    if (!req.url.includes('apimarketplace')) {
      authorizedRequest = req.clone({
        headers: headersNew.append('Authorization', `Bearer ${localStorage.getItem('token') ?? ''}`),
      });
    }

    return next.handle(authorizedRequest);

  }

}
