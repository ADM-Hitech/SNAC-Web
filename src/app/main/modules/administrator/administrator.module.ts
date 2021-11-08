import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorComponent } from './administrator.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AdministratorRouting } from './administrator.routing';
import { AdministratorService } from './administrator.service';


@NgModule({
  declarations: [AdministratorComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdministratorRouting
  ],
  providers: [
    AdministratorService
  ]
})
export class AdministratorModule { }
