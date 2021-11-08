import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancesReceivableComponent } from './advances-receivable.component';
import { TableAdvancesReceivableComponent } from './table-advances-receivable/table-advances-receivable.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AdvancesReceivableRouting } from './advances-receivable.routing';
import { AdvancesReceivableService } from './advances-receivable.service';



@NgModule({
  declarations: [
    AdvancesReceivableComponent,
    TableAdvancesReceivableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdvancesReceivableRouting
  ],
  providers: [
    AdvancesReceivableService
  ]
})
export class AdvancesReceivableModule { }
