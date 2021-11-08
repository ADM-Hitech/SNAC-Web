import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { NavigationModule } from '../core/components/navigation/navigation.module';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from '../core/services/auth/auth.service';
import { ModulesComponent } from './modules/modules.component';
import { QuickPanelComponent } from './quick-panel/quick-panel.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppNavbarToggleDirective } from './navbar/navbar-toggle.directive';
import { WsNotificationService } from '../core/services/websockets/ws-notification.service';
import { QuickPanelService } from '../core/services/rest/quick-panel.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NavigationModule
  ],
  declarations: [
    ModulesComponent,
    MainComponent,
    FooterComponent,
    QuickPanelComponent,
    ToolbarComponent,
    NavbarComponent,
    AppNavbarToggleDirective
  ],
  exports: [
    MainComponent
  ],
  providers: [
    WsNotificationService,
    AuthService,
    QuickPanelService
  ]
})
export class MainModule { }
