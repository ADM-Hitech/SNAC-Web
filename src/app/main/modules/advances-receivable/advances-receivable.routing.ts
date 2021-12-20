import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvancesReceivableComponent } from './advances-receivable.component';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';

const router: Routes = [
    {
        path: '',
        component: AdvancesReceivableComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Administrador', 'License']
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class AdvancesReceivableRouting {}
