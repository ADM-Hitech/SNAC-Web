import { Component, HostBinding, HostListener, Input, OnDestroy } from '@angular/core';
import { appAnimations } from '../../../../animations';
import { AppConfigService } from '../../../../services/config.service';
import { Subscription } from 'rxjs';

@Component({
    selector   : 'app-nav-horizontal-collapse',
    templateUrl: './nav-horizontal-collapse.component.html',
    styleUrls  : ['./nav-horizontal-collapse.component.scss'],
    animations : appAnimations
})
export class AppNavHorizontalCollapseComponent implements OnDestroy
{
    onSettingsChanged: Subscription;
    appSettings: any;
    isOpen = false;

    @HostBinding('class') classes = 'nav-item nav-collapse';
    @Input() item: any;

    @HostListener('mouseenter')
    open()
    {
        this.isOpen = true;
    }

    @HostListener('mouseleave')
    close()
    {
        this.isOpen = false;
    }

    constructor(
        private appConfig: AppConfigService
    )
    {
        this.onSettingsChanged =
            this.appConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.appSettings = newSettings;
                    }
                );
    }

    ngOnDestroy()
    {
        this.onSettingsChanged.unsubscribe();
    }
}
