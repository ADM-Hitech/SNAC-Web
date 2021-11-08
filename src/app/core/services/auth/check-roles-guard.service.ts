import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CheckRolesGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.auth.checkRols(next.data.roles)) {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }
}
