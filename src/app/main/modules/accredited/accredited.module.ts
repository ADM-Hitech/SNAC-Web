import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccreditedComponent } from './accredited.component';
import { TableAccreditedComponent } from './table-accredited/table-accredited.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AccreditedRouting } from './accredited.routing';
import { AccreditedService } from './accredited.service';


@NgModule({
  declarations: [
    AccreditedComponent,
    TableAccreditedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccreditedRouting
  ],
  providers: [
    AccreditedService
  ]
})
export class AccreditedModule { }
