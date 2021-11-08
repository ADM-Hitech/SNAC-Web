import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../navigation.service';
import { NavigationEnd, Router } from '@angular/router';
import { appAnimations } from '../../../../animations';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector   : 'app-nav-vertical-collapse',
    templateUrl: './nav-vertical-collapse.component.html',
    styleUrls  : ['./nav-vertical-collapse.component.scss'],
    animations : appAnimations
})
export class AppNavVerticalCollapseComponent implements OnInit
{
    @Input() item: any;
    @HostBinding('class') classes = 'nav-collapse nav-item';
    @HostBinding('class.open') public isOpen = false;

    constructor(
        private navigationService: NavigationService,
        private router: Router,
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    )
    {

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

        // Listen for route changes
        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationEnd )
                {
                    // Check if the url can be found in
                    // one of the children of this item
                    if ( this.isUrlInChildren(this.item, event.urlAfterRedirects) )
                    {
                        this.expand();
                    }
                    else
                    {
                        this.collapse();
                    }
                }
            }
        );

        // Listen for collapsing of any navigation item
        this.navigationService.onNavCollapseToggled
            .subscribe(
                (clickedItem) => {
                    if ( clickedItem && clickedItem.children )
                    {
                        // Check if the clicked item is one
                        // of the children of this item
                        if ( this.isChildrenOf(this.item, clickedItem) )
                        {
                            return;
                        }

                        // Check if the url can be found in
                        // one of the children of this item
                        if ( this.isUrlInChildren(this.item, this.router.url) )
                        {
                            return;
                        }

                        // If the clicked item is not this item, collapse...
                        if ( this.item !== clickedItem )
                        {
                            this.collapse();
                        }
                    }
                }
            );
    }

    ngOnInit()
    {
        // Check if the url can be found in
        // one of the children of this item
        if ( this.isUrlInChildren(this.item, this.router.url) )
        {
            this.expand();
        }
        else
        {
            this.collapse();
        }
    }

    /**
     * Toggle collapse
     *
     * @param ev
     */
    toggleOpen(ev)
    {
        ev.preventDefault();

        this.isOpen = !this.isOpen;

        // Navigation collapse toggled...
        this.navigationService.onNavCollapseToggled.emit(this.item);
        this.navigationService.onNavCollapseToggle.emit();
    }

    /**
     * Expand the collapsable navigation
     */
    expand()
    {
        if ( this.isOpen )
        {
            return;
        }

        this.isOpen = true;
        this.navigationService.onNavCollapseToggle.emit();
    }

    /**
     * Collapse the collapsable navigation
     */
    collapse()
    {
        if ( !this.isOpen )
        {
            return;
        }

        this.isOpen = false;
        this.navigationService.onNavCollapseToggle.emit();
    }

    /**
     * Check if the given parent has the
     * given item in one of its children
     *
     * @param parent
     * @param item
     * @return {any}
     */
    isChildrenOf(parent, item)
    {
        if ( !parent.children )
        {
            return false;
        }

        if ( parent.children.indexOf(item) !== -1 )
        {
            return true;
        }

        for ( const children of parent.children )
        {
            if ( children.children )
            {
                return this.isChildrenOf(children, item);
            }
        }
    }

    /**
     * Check if the given url can be found
     * in one of the given parent's children
     *
     * @param parent
     * @param url
     * @returns {any}
     */
    isUrlInChildren(parent, url)
    {
        if ( !parent.children )
        {
            return false;
        }

        for ( let i = 0; i < parent.children.length; i++ )
        {
            if ( parent.children[i].children )
            {
                if ( this.isUrlInChildren(parent.children[i], url) )
                {
                    return true;
                }
            }

            if ( parent.children[i].url === url || url.includes(parent.children[i].url) )
            {
                return true;
            }
        }

        return false;
    }

}
