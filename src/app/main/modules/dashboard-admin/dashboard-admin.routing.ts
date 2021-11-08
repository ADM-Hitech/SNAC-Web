import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin.component';
import { AuthGuardService } from 'src/app/core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from 'src/app/core/services/auth/check-roles-guard.service';

const routes: Routes = [
    {
        path: '',
        component: DashboardAdminComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Administrador']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardAdminRouting {}
