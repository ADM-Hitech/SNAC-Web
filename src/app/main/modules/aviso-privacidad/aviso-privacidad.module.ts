import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisoPrivasidadComponent } from './aviso-privacidad.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AvisoPrivasidadRouting } from './aviso-privacidad.routing';

@NgModule({
  declarations: [
    AvisoPrivasidadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AvisoPrivasidadRouting
  ]
})
export class AvisoPrivasidadModule { }
