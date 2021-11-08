import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FondeoControlComponent } from './fondeo-control.component';
import { TableFondeoControlComponent } from './table-fondeo-control/table-fondeo-control.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { FondeoControlRouting } from './fondeo-control.routing';
import { FondeoControlService } from './fondeo-control.service';



@NgModule({
  declarations: [
    FondeoControlComponent,
    TableFondeoControlComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FondeoControlRouting
  ],
  providers: [
    FondeoControlService
  ]
})
export class FondeoControlModule { }
