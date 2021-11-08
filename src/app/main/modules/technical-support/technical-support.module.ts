import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalSupportComponent } from './technical-support.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { TechnicalSupportRouting } from './technical-support.routing';



@NgModule({
  declarations: [TechnicalSupportComponent],
  imports: [
    CommonModule,
    SharedModule,
    TechnicalSupportRouting
  ]
})
export class TechnicalSupportModule { }
