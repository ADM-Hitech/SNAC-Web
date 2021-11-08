import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestorComponent } from './investor.component';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';

const router: Routes = [
    {
        path: '',
        component: InvestorComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Inversionista', 'Administrador']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class InvertorRouting {}
