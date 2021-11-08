import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardAdminComponent } from './dashboard-admin.component';
import { CommissionsAndInterestsComponent } from './commissions-and-interests/commissions-and-interests.component';
import { CreditNumberComponent } from './credit-number/credit-number.component';
import { InvestmentsComponent } from './investments/investments.component';
import { LiquidityComponent } from './liquidity/liquidity.component';
import { DashboardAdminRouting } from './dashboard-admin.routing';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    DashboardAdminComponent,
    CommissionsAndInterestsComponent,
    CreditNumberComponent,
    InvestmentsComponent,
    LiquidityComponent
  ],
  imports: [
    DashboardAdminRouting,
    SharedModule,
    CommonModule,
    NgxChartsModule
  ]
})
export class DashboardAdminModule { }
