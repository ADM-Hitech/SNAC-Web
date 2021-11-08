import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvestorComponent } from './investor/investor.component';
import { GroupUsersComponent } from './group-users/group-users.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { AccreditedComponent } from './accredited/accredited.component';
import { CreateUsersComponent } from './create-users.component';
import { AuthGuardService } from '../../../core/services/auth/auth-guard.service';
import { CheckRolesGuardService } from '../../../core/services/auth/check-roles-guard.service';

const routes: Routes = [
    {
        path: '',
        component: CreateUsersComponent,
        children: [
            {
                path: '',
                component: InvestorComponent
            },
            {
                path: 'accredited',
                component: AccreditedComponent
            },
            {
                path: 'administrator',
                component: AdministratorComponent
            },
            {
                path: 'group-users',
                component: GroupUsersComponent
            }
        ],
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
export class CreateUsersRouting {}
