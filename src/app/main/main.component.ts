import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  HostBinding,
  ElementRef,
  Renderer2,
  Inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppConfigService } from '../core/services/config.service';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { WsNotificationService } from '../core/services/websockets/ws-notification.service';
import { NotificationService } from '../core/services/notification/notification.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {

  onSettingsChanged: Subscription;
  onWsNotification: Subscription;
  appSettings: any;
  @HostBinding('attr.app-layout-mode') layoutMode;

  constructor(
    private appConfig: AppConfigService,
    private platform: Platform,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private notificationService: NotificationService,
    private wsNotification: WsNotificationService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private auth: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.onSettingsChanged =
      this.appConfig.onSettingsChanged
        .subscribe((newSettings) => {
          this.appSettings = newSettings;
          this.layoutMode = this.appSettings.layout.mode;
        });

    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += ' is-mobile';
    }

    this.matIconRegistry.addSvgIcon(
      'logoMenu',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-menu.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'logoNotification',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-notificaciones.svg')
    );
  }

  ngOnInit() {
    const userId = this.auth.id;

    if (this.wsNotification.notification === undefined) {
      return;
    }

    this.onWsNotification = this.wsNotification.notification.subscribe((notification: any) => {

      try {
        let alert = JSON.parse(notification.data);

        if (typeof alert === 'string') {
          alert = JSON.parse(alert);
        }

        if (typeof alert !== 'string') {
          if (userId.toString() === alert.User_Id.toString()) {
            if (alert.Message === 'deleteuser') {

                localStorage.clear();
                this.notificationService.removeAll();
                this.router.navigate(['/login']);

            } else {
              this.notificationService.addAlert({
                data: alert.Data,
                icon: alert.Icon,
                id: alert.id,
                message: alert.Message,
                title: alert.Title,
                shown: false
              });
            }
          }
        }
      } catch (e) {}
    });
  }

  ngOnDestroy() {
    this.onSettingsChanged.unsubscribe();
    this.onWsNotification.unsubscribe();
  }

  addClass(className: string): void {
    this.renderer.addClass(this.elementRef.nativeElement, className);
  }

  removeClass(className: string): void {
      this.renderer.removeClass(this.elementRef.nativeElement, className);
  }

}
