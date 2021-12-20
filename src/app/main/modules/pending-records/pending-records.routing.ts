import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from 'src/app/core/services/auth/check-roles-guard.service';
import { PendingRecordComponent } from './pending-records.component';

const router: Routes = [
    {
        path: '',
        component: PendingRecordComponent,
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
export class PendingRecordRouting {}
