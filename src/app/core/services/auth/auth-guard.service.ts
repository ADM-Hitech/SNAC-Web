import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  constructor(
    public auth: AuthService,
    public router: Router,
    private routeActivate: ActivatedRoute,
    private appConfig: AppConfigService
  ) {
    appConfig.lastRoute = '';
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (!this.auth.isAuthenticated()) {
      this.appConfig.lastRoute = state.url;
      this.router.navigate(['login']);
      return false;
    }

    if (!this.auth.checkRols(next.data.roles)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
