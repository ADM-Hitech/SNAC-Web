import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Alert } from '../quick-panel/alert.model';
import { NotificationService } from '../../core/services/notification/notification.service';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { UploadVoucherCapitalComponent } from '../../core/components/upload-voucher-capital/upload-voucher-capital.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { QuickPanelService } from 'src/app/core/services/rest/quick-panel.service';

@Component({
  selector: 'app-quick-panel',
  templateUrl: './quick-panel.component.html',
  styleUrls: ['./quick-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, OnDestroy {

  public date: Date;
  public Alerts: Alert[] = [];
  public userId;
  public userType;

  constructor(
    private notificationService: NotificationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private userAuth: AuthService,
    private rest: QuickPanelService
  ) {
    this.matIconRegistry.addSvgIcon(
      'iconNotification',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-notificaciones.svg')
    );

    this.userId = this.userAuth.id;
    this.userType = this.userAuth.typeId;
  }

  ngOnInit() {
    this.getNotification();
    this.notificationService.alerts.subscribe(alerts => {
      this.Alerts = alerts;
    });
  }

  ngOnDestroy(): void {}

  public showAlert(alert: Alert) {
    alert.shown = !alert.shown;
  }

  public deleteAllAlert() {
      this.notificationService.alerts.next([]);
  }

  openNotification(alert: Alert): void {
    if (!!alert.data &&
      !!alert.data.Capital_Id &&
      !!alert.data.Amount &&
      this.userAuth.getRol() !== 'Administrador'
    ) {
      const returnDialog = this.dialog.open(UploadVoucherCapitalComponent, {
        data: {
          capitaId: alert.data.Capital_Id,
          userId: this.userId,
          userType: this.userType,
          alertId: alert.id
        }
      });

      returnDialog.afterClosed().subscribe((response) => {
        if (response) {
          const all = this.notificationService.alerts.value.filter((element) => element.id !== alert.id);
          this.notificationService.alerts.next(all);
        }
      });
    }
  }

  getNotification(): void {
    this.rest.getNotification().subscribe((response) => {
      if (response.success) {
        this.Alerts = response.data.map((notification) => ({
          data: notification.data,
          icon: notification.icon,
          id: notification.id,
          message: notification.message,
          shown: false,
          title: notification.title
        }) as Alert);

        this.notificationService.alerts.next(this.Alerts);
      }
    }, err => {});
  }

  deleteNotification(): void {
    let deletNotification = this.Alerts.filter((element) => element.data == null ||
      !(!!element.data.Capital_Id && !!element.data.Amount)).map((ele) => ele.id);

    if (this.userAuth.getRol() === 'Administrador') {
      deletNotification = this.Alerts.map((ele) => ele.id);
    }

    const all = this.notificationService.alerts.value.filter((element) => !!!deletNotification.filter((ele) => ele === element.id));
    this.notificationService.alerts.next(all);

    this.rest.deleteNotification(deletNotification).subscribe((response) => { }, err => {});
  }
}
