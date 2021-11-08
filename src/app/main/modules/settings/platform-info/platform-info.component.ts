import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-platform-info',
  templateUrl: './platform-info.component.html',
  styleUrls: ['./platform-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlatformInfoComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'iconPlatform',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-ajustes-info-app1.svg')
    );
  }

  ngOnInit(): void {
  }

}
