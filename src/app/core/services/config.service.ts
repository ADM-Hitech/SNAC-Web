import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Subject } from 'rxjs';
import * as moment from 'moment';
import * as jwtDecode from 'jwt-decode';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material';
import { UserLogin } from '../models/user-login.model';

@Injectable()
export class AppConfigService {

    public settings: any;
    public defaultSettings: any;
    public onSettingsChanged: BehaviorSubject<{
        layout: {
            navigation: 'right' | 'left' | 'top' | 'none'
            navigationFolded: boolean,
            toolbar: 'above' | 'below' | 'none',
            footer: 'above' | 'below' | 'none',
            mode: 'fullwidth' | 'boxed'
        },
        colorClasses: {
            toolbar: string,
            navbar: string,
            footer: string
        },
        customScrollbars: boolean,
        routerAnimation: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideRight' | 'slideLeft' | 'none'
    }>;
    public helpPage: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public lastRoute: string;

    constructor(
        private router: Router,
        public platform: Platform,
        public auth: AuthService,
        private dialog: MatDialog
    ) {
        // Set the default settings
        this.defaultSettings = {
            layout          : {
                navigation      : 'left', // 'right', 'left', 'top', 'none'
                navigationFolded: false, // true, false
                toolbar         : 'above', // 'above', 'below', 'none'
                footer          : 'none', // 'above', 'below', 'none'
                mode            : 'fullwidth' // 'boxed', 'fullwidth'
            },
            colorClasses    : {
                toolbar: 'mat-white-500-bg',
                navbar : 'mat-fuse-dark-600-bg',
                footer : 'mat-fuse-dark-900-bg'
            },
            customScrollbars: true,
            routerAnimation : 'slideLeft' // fadeIn, slideUp, slideDown, slideRight, slideLeft, none
        };

        /**
         * Disable Custom Scrollbars if Browser is Mobile
         */
        if ( this.platform.ANDROID || this.platform.IOS ) {
            this.defaultSettings.customScrollbars = false;
        }

        // Set the settings from the default settings
        this.settings = Object.assign({}, this.defaultSettings);

        // Create the behavior subject
        this.onSettingsChanged = new BehaviorSubject(this.settings);

        // Reload the default settings on every navigation start
        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart ) {
                    if (event.url.includes('login') || 
                        event.url === '/aviso-privacidad' ||
                        event.url === '/terminos-y-condiciones')
                    {
                        this.defaultSettings.layout.navigation = 'none';
                        this.defaultSettings.layout.toolbar = 'none';
                    } else {
                        this.defaultSettings.layout.navigation = 'left';
                        this.defaultSettings.layout.toolbar = 'above';
                    }

                    this.setSettings({layout: this.defaultSettings.layout});
                }
            }
        );

        if (!this.auth.isAuthenticated()) {
            this.defaultSettings.layout.navigation = 'none';
            this.defaultSettings.layout.toolbar = 'none';
        }
    }

    setSettings(settings) {
        // Set the settings from the given object
        this.settings = Object.assign({}, this.settings, settings);
        // Trigger the event
        this.onSettingsChanged.next(this.settings);
    }

    get User() {
        return this.auth.isAuthenticated() ? jwtDecode(localStorage.getItem('token')) as UserLogin : new UserLogin();
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    changeStatusHelp(status?: boolean): void {
        if (typeof status !== 'undefined') {
            this.helpPage.next(status);
        } else {
            this.helpPage.next(!this.helpPage.value);
        }
    }
}

