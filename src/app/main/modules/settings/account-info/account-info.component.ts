import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { InvestorService } from '../../investor/investor.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccountInfoComponent implements OnInit {
  loading = false;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private rest: InvestorService) {
    this.matIconRegistry.addSvgIcon(
      'iconDocument',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-ajustes-info-cuenta1.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconDocumentBtn',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-boton-informe.svg')
    );
  }

  ngOnInit(): void {
  }

  exportMyInvestment() {
    this.loading = true;
    this.rest.fetchFile(1).subscribe(result => {
      this.loading = false;
      const url = window.URL.createObjectURL(result.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = result.filename;
      a.click();
    });
  }

}
