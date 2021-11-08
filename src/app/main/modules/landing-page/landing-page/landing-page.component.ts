import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalContactComponent } from '../../../../core/components/modal-contact/modal-contact.component';
import { appAnimations } from '../../../../core/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class LandingPageComponent implements OnInit {

  public isOpenMenu = false;
  public activeMenu = '';
  public positionScroll = 0;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      'logoMenu',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-menu.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'logoWhite',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-logo.svg')
    );
  }

  ngOnInit() {
  }

  openContact(): void {
    this.dialog.open(ModalContactComponent, {

    });
  }

  goTo(section: string): void {
    const element = document.getElementById(section);
    if (element) { element.scrollIntoView(); }
  }

  showMenu(): void {
    this.isOpenMenu = !this.isOpenMenu;
  }

  onScroll($event: any) {
    const scrollOffset = $event.srcElement.scrollTop;
    this.activeMenu = '';
    this.positionScroll = scrollOffset;

    const howWork = document.getElementById('howWork')?.offsetTop;
    const howWorkHight = document.getElementById('howWork')?.offsetHeight;
    const requirement = document.getElementById('requirement')?.offsetTop;
    const requirementHight = document.getElementById('requirement')?.offsetHeight;
    const employer = document.getElementById('employer')?.offsetTop;
    const employerHight = document.getElementById('employer')?.offsetHeight;

    if (scrollOffset > (howWork - 200) && scrollOffset < (howWork + howWorkHight)) {
      this.activeMenu = 'howWork';
    }

    if (scrollOffset > (requirement - 200) && scrollOffset < (requirement + requirementHight)) {
      this.activeMenu = 'requirement';
    }

    if (scrollOffset > employer - 200) {
      this.activeMenu = 'employer';
    }

  }

}
