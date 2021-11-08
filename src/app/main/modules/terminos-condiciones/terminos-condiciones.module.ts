import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminosCondicionesComponent } from './terminos-condiciones.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { TerminosCondicionesRouting } from './terminos-condiciones.routing';

@NgModule({
  declarations: [TerminosCondicionesComponent],
  imports: [
    CommonModule,
    SharedModule,
    TerminosCondicionesRouting
  ]
})
export class TerminosCondicionesModule { }
