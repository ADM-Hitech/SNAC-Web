import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-technical-support',
  templateUrl: './technical-support.component.html',
  styleUrls: ['./technical-support.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TechnicalSupportComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'iconTelephone',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-telefono.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconWhatsapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-whatsapp.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconEmail',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-correo.svg')
    );
  }

  ngOnInit(): void {
  }

}
