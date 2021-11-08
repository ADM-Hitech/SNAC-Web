import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile.component';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';

const router: Routes = [
    {
        path: '',
        component: MyProfileComponent,
        canActivate: [AuthGuardService, CheckRolesGuardService],
        data: {
            roles: ['Inversionista', 'Acreditado']
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(router)],
    exports: [RouterModule]
})
export class MyProfileRouting {}
