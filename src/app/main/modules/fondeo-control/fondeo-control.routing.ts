import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FondeoControlComponent } from './fondeo-control.component';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';

const router: Routes = [
    {
        path: '',
        component: FondeoControlComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Administrador']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class FondeoControlRouting {}
