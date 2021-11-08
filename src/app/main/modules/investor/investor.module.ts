import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvestorComponent } from './investor.component';
import { TableInvestorComponent } from './table-investor/table-investor.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { InvertorRouting } from './investor.routing';
import { InvestorService } from './investor.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';


@NgModule({
  declarations: [
    InvestorComponent,
    TableInvestorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvertorRouting,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    InvestorService
  ]
})
export class InvestorModule { }
