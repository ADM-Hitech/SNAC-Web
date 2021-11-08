import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorComponent } from './administrator.component';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';

const router: Routes = [
    {
        path: '',
        component: AdministratorComponent,
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
export class AdministratorRouting {}
