import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { appAnimations } from '../../../core/animations';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-aviso-privasidad',
  templateUrl: './aviso-privacidad.component.html',
  styleUrls: ['./aviso-privacidad.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class AvisoPrivasidadComponent implements OnInit {

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
