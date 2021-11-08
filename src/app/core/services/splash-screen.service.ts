import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';

@Injectable()
export class AppSplashScreenService {
    splashScreenEl;
    splashPages;
    public player: AnimationPlayer;

    constructor(
        private animationBuilder: AnimationBuilder,
        @Inject(DOCUMENT) private document: any,
        private router: Router
    ) {
        this.splashScreenEl = this.document.body.querySelector('#app-splash-screen');
        this.splashPages = this.document.body.querySelector('#page-splash-screen');

        const hideOnLoad = this.router.events.subscribe((event) => {
                if ( event instanceof NavigationEnd ) {
                    setTimeout(() => {
                        this.hide();
                        hideOnLoad.unsubscribe();
                    }, 0);
                }
            }
        );
    }

    show() {
        this.player =
            this.animationBuilder
                .build([
                    style({
                        opacity: '0',
                        zIndex : '99999'
                    }),
                    animate('400ms ease', style({opacity: '1'}))
                ]).create(this.splashScreenEl);

        setTimeout(() => {
            this.player.play();
        }, 0);
    }

    hide() {
        this.player =
            this.animationBuilder
                .build([
                    style({opacity: '1'}),
                    animate('400ms ease', style({
                        opacity: '0',
                        zIndex : '-10'
                    }))
                ]).create(this.splashScreenEl);

        setTimeout(() => {
            this.player.play();
        }, 0);
    }

    showSplasPage() {
        this.splashPages = this.document.body.querySelector('#page-splash-screen');

        const playerPage =
            this.animationBuilder
                .build([
                    style({
                        opacity: '0',
                        zIndex : '99999'
                    }),
                    animate(10, style({opacity: '1'}))
                ]).create(this.splashPages);

        setTimeout(() => {
            playerPage.play();
        }, 10);
    }

    hideSplasPage() {
        this.splashPages = this.document.body.querySelector('#page-splash-screen');

        const playerPage =
            this.animationBuilder
                .build([
                    style({opacity: '1'}),
                    animate(500, style({
                        opacity: '0',
                        zIndex : '-10'
                    }))
                ]).create(this.splashPages);

        setTimeout(() => {
            playerPage.play();
        }, 500);
    }
}
