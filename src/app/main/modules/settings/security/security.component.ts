import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecurityComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'iconSecurity',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-ajustes-seguridad1.svg')
    );
  }

  ngOnInit(): void {
  }

}
