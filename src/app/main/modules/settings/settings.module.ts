import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SecurityComponent } from './security/security.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { SettingsRouting } from './settings.routing';



@NgModule({
  declarations: [
    SettingsComponent,
    SecurityComponent,
    AccountInfoComponent,
    PlatformInfoComponent,
    DeleteAccountComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingsRouting
  ]
})
export class SettingsModule { }
