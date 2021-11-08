import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-section-welcome',
  templateUrl: './section-welcome.component.html',
  styleUrls: ['./section-welcome.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionWelcomeComponent implements OnInit {

  @Output() goTo = new EventEmitter<any>();

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'logoWhite',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-logo.svg')
    );
  }

  ngOnInit() {}

  _goTo(): void {
    this.goTo.emit();
  }

}
