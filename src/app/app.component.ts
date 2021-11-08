import { Component } from '@angular/core';
import { NavigationService } from './core/components/navigation/navigation.service';
import { AppNavigationModel } from './core/models/navigation.model';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private appNavigationService: NavigationService,
    private auth: AuthService
  ) {

    if (this.auth.isAuthenticated()) {
      this.appNavigationService.setNavigationModel(new AppNavigationModel(this.auth.getRol(), this.auth.modules));
    } else {
      this.appNavigationService.setNavigationModel(new AppNavigationModel());
    }
  }
}
