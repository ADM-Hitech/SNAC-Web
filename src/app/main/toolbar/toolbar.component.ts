import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { Alert } from '../quick-panel/alert.model';
import { MatDialog } from '@angular/material';
import { ChangePasswordModalComponent } from '../../core/components/change-password/change-password.component';
import { ChangePasswordComponent } from '../modules/login/change-password/change-password.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public showLoadingBar: boolean;
  public horizontalNav: boolean;
  public username: string;
  public rol: string;
  public activeNotification: boolean;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.showLoadingBar = true;
        }

        if (event instanceof NavigationEnd) {
          this.showLoadingBar = false;
        }
      }
    );

    this.username = localStorage.getItem('completeName');
    this.rol = this.auth.getRol();
    this.activeNotification = false;
  }

  ngOnInit(): void {
    this.notificationService.alerts.subscribe((alerts: Array<Alert>) => {
      this.activeNotification = alerts.length > 0;
    });
  }

  logAuth(): void {
    localStorage.clear();
    this.notificationService.removeAll();
    this.router.navigate(['/login']);
  }

  changePassword(): void {
    this.router.navigate(['/login/change-password']);
  }

}
