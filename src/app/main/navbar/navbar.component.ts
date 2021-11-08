import { Component, OnInit, ViewEncapsulation, OnDestroy, HostBinding, ViewChild, HostListener, Input, Renderer2, ElementRef } from '@angular/core';
import { AppPerfectScrollbarDirective } from '../../core/directives/app-perfect-scrollbar.directive';
import { Subscription } from 'rxjs';
import { AnimationPlayer, AnimationBuilder, animate, style } from '@angular/animations';
import { MainComponent } from '../main.component';
import { AppMatchMedia } from '../../core/services/match-media.service';
import { NavigationService } from '../../core/components/navigation/navigation.service';
import { Router, NavigationEnd } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';
import { AppNavbarService } from './navbar.service';
import { appAnimations } from '../../core/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Input()
  set folded(value: boolean) {
    this._folded = value;

    if (this._folded) {
      this.activateFolded();
    } else {
      this.deActivateFolded();
    }
  }

  get folded(): boolean {
    return this._folded;
  }

  constructor(
    private appMainComponent: MainComponent,
    private appMatchMedia: AppMatchMedia,
    private appNavigationService: NavigationService,
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private animationBuilder: AnimationBuilder,
    private navBarService: AppNavbarService,
    public media: MediaObserver
  ) {

    this.navBarService.setNavBar(this);

    this.navigationServiceWatcher = this.appNavigationService.onNavCollapseToggle.subscribe(() => {
      this.appPerfectScrollbarUpdateTimeout = setTimeout(() => {
        this.appPerfectScroollbarDirective.update();
      }, 310);
    });

    this.matchMediaWatcher =
      this.appMatchMedia.onMediaChange
        .subscribe((mediaStep) => {
          setTimeout(() => {
            if (this.media.isActive('lt-lg')) {
              this.closeBar();
              this.deActivateFolded();
            } else {
              this.openBar();
              this._detachBackdrop();
            }
          });
        });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.media.isActive('lt-lg')) {
          setTimeout(() => {
            this.closeBar();
          });
        }
      }
    });
  }

  private backdropElement: HTMLElement | null = null;
  // tslint:disable-next-line:variable-name
  private _folded = false;

  @HostBinding('class.close') isClosed: boolean;
  @HostBinding('class.folded') isFoldedActive: boolean;
  @HostBinding('class.folded-open') isFoldedOpen: boolean;
  @HostBinding('class.initialized') initialized: boolean;
  @ViewChild(AppPerfectScrollbarDirective, { static: true}) appPerfectScroollbarDirective;

  matchMediaWatcher: Subscription;
  navigationServiceWatcher: Subscription;
  appPerfectScrollbarUpdateTimeout;
  player: AnimationPlayer;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if ( event.target.innerWidth > 1279 ) {
      this.openBar();
    } else {
      this.closeBar();
    }
  }

  ngOnInit(): void {
    this.isClosed = false;
    this.isFoldedActive = this._folded;
    this.isFoldedOpen = false;
    this.initialized = false;
    this.updateCssClasses();

    setTimeout(() => {
      this.initialized = true;
    });

    if (this.media.isActive('lt-lg')) {
      this.closeBar();
      this.deActivateFolded();
    } else {
      if (!this._folded) {
        this.deActivateFolded();
      } else {
        this.activateFolded();
      }
    }
  }

  ngOnDestroy() {
    clearTimeout(this.appPerfectScrollbarUpdateTimeout);
    this.matchMediaWatcher.unsubscribe();
    this.navigationServiceWatcher.unsubscribe();
  }

  openBar() {
    if (!this.isClosed) {
        return;
    }

    this.isClosed = false;
    this.updateCssClasses();
    if (this.media.isActive('lt-lg')) {
        this._attachBackdrop();
    }
  }

  closeBar() {
    this.isClosed = true;
    this.updateCssClasses();
    this._detachBackdrop();
  }

  toggleBar() {
      if (this.isClosed) {
          this.openBar();
      } else {
          this.closeBar();
      }
  }

  toggleFold() {
      if (!this.isFoldedActive) {
          this.activateFolded();
      } else {
          this.deActivateFolded();
      }
  }

  activateFolded() {
    this.isFoldedActive = true;
    this.appMainComponent.addClass('app-nav-bar-folded');
    this.isFoldedOpen = false;
  }

  deActivateFolded() {
    this.isFoldedActive = false;
    this.appMainComponent.removeClass('app-nav-bar-folded');
    this.isFoldedOpen = false;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
      this.isFoldedOpen = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
      this.isFoldedOpen = false;
  }

  updateCssClasses() {
      if (!this.isClosed) {
          this.appMainComponent.addClass('app-navbar-opened');
          this.appMainComponent.removeClass('app-navbar-closed');
      } else {
          this.appMainComponent.addClass('app-navbar-closed');
          this.appMainComponent.removeClass('app-navbar-opened');
      }
  }

  private _attachBackdrop() {
      this.backdropElement = this.renderer.createElement('div');
      this.backdropElement.classList.add('app-navbar-backdrop');

      this.renderer.appendChild(this.elementRef.nativeElement.parentElement, this.backdropElement);

      this.player =
          this.animationBuilder
              .build([
                  animate('400ms ease', style({ opacity: 1 }))
              ]).create(this.backdropElement);

      this.player.play();

      this.backdropElement.addEventListener('click', () => {
          this.closeBar();
      }
      );
  }

  private _detachBackdrop() {
      if (this.backdropElement) {
          this.player =
              this.animationBuilder
                  .build([
                      animate('400ms cubic-bezier(.25,.8,.25,1)', style({ opacity: 0 }))
                  ]).create(this.backdropElement);

          this.player.play();

          this.player.onDone(() => {
              if (this.backdropElement) {
                  this.backdropElement.parentNode.removeChild(this.backdropElement);
                  this.backdropElement = null;
              }
          });
      }
  }

}
