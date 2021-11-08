import { Component, OnInit, HostBinding, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AppConfigService } from '../../core/services/config.service';
import { filter, map } from 'rxjs/operators';
import { appAnimations } from '../../core/animations';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : appAnimations
})
export class ModulesComponent implements OnInit, OnDestroy {

  onSettingsChanged: Subscription;
  appSettings: any;

  @HostBinding('@routerTransitionUp') routeAnimationUp = false;
  @HostBinding('@routerTransitionDown') routeAnimationDown = false;
  @HostBinding('@routerTransitionRight') routeAnimationRight = false;
  @HostBinding('@routerTransitionLeft') routeAnimationLeft = false;
  @HostBinding('@routerTransitionFade') routeAnimationFade = false;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private appConfig: AppConfigService
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activateRoute)
    ).subscribe(() => {
      switch (this.appSettings.routerAnimation) {
        case 'fadeIn':
            this.routeAnimationFade = !this.routeAnimationFade;
            break;
        case 'slideUp':
            this.routeAnimationUp = !this.routeAnimationUp;
            break;
        case 'slideDown':
            this.routeAnimationDown = !this.routeAnimationDown;
            break;
        case 'slideRight':
            this.routeAnimationRight = !this.routeAnimationRight;
            break;
        case 'slideLeft':
            this.routeAnimationLeft = !this.routeAnimationLeft;
            break;
      }
    });

    this.onSettingsChanged = this.appConfig.onSettingsChanged.subscribe((newSettings) => {
      this.appSettings = newSettings;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.onSettingsChanged.unsubscribe();
  }

}
