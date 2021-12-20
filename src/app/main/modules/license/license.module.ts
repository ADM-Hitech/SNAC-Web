import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AccreditedComponent } from '../accredited/accredited.component';
import { AccreditedLicenseComponent } from './accredited-license/accredited_license.component';
import { TableLicenseAccreditedComponent } from './accredited-license/table-license-accredited/table-license-accredited.component';
import { LicenseFundingControlComponent } from './license-funding-control/license-funding-control.component';
import { TableFoundingComponent } from './license-funding-control/table-founding/table-founding.component';
import { LicenseRouting } from './license.routing';
import { LicenseService } from './license.service';
import { LicensesComponent } from './licenses.component';
import { TableLicenseComponent } from './table-license/table-license.component';

@NgModule({
    declarations: [
        TableLicenseComponent,
        LicensesComponent,
        AccreditedLicenseComponent,
        TableLicenseAccreditedComponent,
        LicenseFundingControlComponent,
        TableFoundingComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        LicenseRouting
    ],
    providers: [
        LicenseService
    ]
})
export class LicenseModule {}
