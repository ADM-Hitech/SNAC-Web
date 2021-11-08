import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { MyProfileRouting } from './my-profile.routing';
import { MyProfileService } from './my-profile.service';


@NgModule({
  declarations: [
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MyProfileRouting
  ],
  providers: [
    MyProfileService
  ]
})
export class MyProfileModule { }
