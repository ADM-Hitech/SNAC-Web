import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { appAnimations } from '../../../core/animations';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class TerminosCondicionesComponent implements OnInit {

  public positionScroll = 0;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      'logoMenu',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-menu.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'logoWhite',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-logo.svg')
    );
  }

  ngOnInit(): void {
  }

  onScroll($event: any) {
    const scrollOffset = $event.srcElement.scrollTop;
    this.positionScroll = scrollOffset;
  }

}
