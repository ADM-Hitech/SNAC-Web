import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from 'src/app/core/services/auth/check-roles-guard.service';
import { AccountStatusLicenseComponent } from './account-status-license.component';

const router: Routes = [
    {
        path: '',
        component: AccountStatusLicenseComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Administrador', 'License']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class AccountStatusLicenseRouting {}
