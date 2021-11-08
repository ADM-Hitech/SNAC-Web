import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestmentsComponent } from './investments.component';
import { TableInvestmentsComponent } from './table-investments/table-investments.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { InvestmentsRouting } from './investments.routing';
import { InvestmentsService } from './investments.service';

@NgModule({
  declarations: [
    InvestmentsComponent,
    TableInvestmentsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvestmentsRouting
  ],
  providers: [
    InvestmentsService
  ]
})
export class InvestmentsModule { }
