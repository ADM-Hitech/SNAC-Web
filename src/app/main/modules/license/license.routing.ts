import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from 'src/app/core/services/auth/check-roles-guard.service';
import { AccreditedLicenseComponent } from './accredited-license/accredited_license.component';
import { LicenseFundingControlComponent } from './license-funding-control/license-funding-control.component';
import { LicensesComponent } from './licenses.component';

const router: Routes = [
    {
        path: '',
        component: LicensesComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Administrador', 'License']
        }
    },
    {
        path: ':id/accredited',
        component: AccreditedLicenseComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Administrador', 'License']
        }
    },
    {
        path: ':id/control-fondeo',
        component: LicenseFundingControlComponent,
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
export class LicenseRouting {}
