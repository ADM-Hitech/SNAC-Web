import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
    selector   : 'app-nav-vertical-item',
    templateUrl: './nav-vertical-item.component.html',
    styleUrls  : ['./nav-vertical-item.component.scss']
})
export class AppNavVerticalItemComponent implements OnInit
{
    @HostBinding('class') classes = 'nav-item';
    @Input() item: any;

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        this.matIconRegistry.addSvgIcon(
            'logoDashboard',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-dashboard.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'logoUsers',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-usuarios.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'logoControls',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-control-fondeo.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'logoAdvance',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-adelantos-por-cobrar.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'logoProfile',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-usuario.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'logoInversiones',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-inversiones.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'iconSettings',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-ajustes.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'iconTechnicalSupport',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-soporte-tecnico.svg')
        );
        this.matIconRegistry.addSvgIcon(
            'iconInversiont',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../../assets/icons/ico-inversiones.svg')
        );
    }

    ngOnInit() {}
}
