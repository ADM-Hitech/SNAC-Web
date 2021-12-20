import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AccountStatusLicenseComponent } from './account-status-license.component';
import { AccountStatusLicenseRouting } from './account-status-license.routing';
import { AccountStatusLicenseService } from './account-status-license.service';
import { TableMovementComponent } from './table-movements/table-movements.component';

@NgModule({
    declarations: [
        AccountStatusLicenseComponent,
        TableMovementComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AccountStatusLicenseRouting
    ],
    providers: [
        AccountStatusLicenseService
    ]
})
export class AccountStatusLicenseModule { }
