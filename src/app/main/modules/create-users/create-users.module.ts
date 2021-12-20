import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUsersComponent } from './create-users.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { GroupUsersComponent } from './group-users/group-users.component';
import { InvestorComponent } from './investor/investor.component';
import { AccreditedComponent } from './accredited/accredited.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { CreateUsersRouting } from './create-users.routing';
import { CreateUserService } from './create-users.service';
import { GroupSnacComponent } from './group-snac/group-snac.component';
import { LicenseComponent } from './license/license.component';


@NgModule({
  declarations: [
    CreateUsersComponent,
    AdministratorComponent,
    GroupUsersComponent,
    InvestorComponent,
    AccreditedComponent,
    GroupSnacComponent,
    LicenseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CreateUsersRouting
  ],
  providers: [
    CreateUserService
  ]
})
export class CreateUsersModule { }
