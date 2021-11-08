import { InvestmentsComponent } from './investments.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';

const router: Routes = [
    {
        path: '',
        component: InvestmentsComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Inversionista']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class InvestmentsRouting {}
