import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { AvisoPrivacidadComponent } from 'src/app/core/components/aviso-privacidad/aviso-privacidad.component';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlatformInfoComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      'iconPlatform',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-ajustes-info-app1.svg')
    );
  }

  ngOnInit(): void {
  }

  public showAviso(): void {
    this.dialog.open(AvisoPrivacidadComponent, {
      data: {
        hiddeButtons: true
      }
    });
  }

}
