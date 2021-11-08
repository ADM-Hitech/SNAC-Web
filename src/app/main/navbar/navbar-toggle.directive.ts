import { Directive, HostListener, Input } from '@angular/core';
import { NavbarComponent } from './navbar.component';
import { AppNavbarService } from './navbar.service';

@Directive({
    selector: '[appNavbar]'
})
export class AppNavbarToggleDirective {
    @Input() appNavbar: string;
    public navbar: NavbarComponent;

    constructor(private navbarService: AppNavbarService) {}

    @HostListener('click') onClick() {
        this.navbar = this.navbarService.getNavBar();

        if (!this.navbar[this.appNavbar]) {
            return;
        }

        this.navbar[this.appNavbar]();
    }
}
