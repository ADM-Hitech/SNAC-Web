import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { forkJoin } from 'rxjs';
import { DashboardAdminService } from './dashboard-admin.service';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardAdminComponent implements OnInit {

  public filters = {
    start_date: '2020-06-01',
    end_date: '2020-07-01', // moment().endOf('month').format('YYYY-MM-DD'),
    Is_Specifid_Day: false,
    filter: 'today'
  };
  public loading = true;

  public dataComitionInterest = null;
  public dataCreditNumber = null;
  public dataInvestments = null;
  public dataLiquidity = null;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private restService: DashboardAdminService
  ) {
    this.matIconRegistry.addSvgIcon(
      'iconIntereses',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-intereses.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconComision',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-comisiones.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconCreditos',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-creditos.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconInteresPagados',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-intereses-pagados.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconRetornoPrincipal',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-retorno-principal.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconCapital',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-capital.svg')
    );
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    forkJoin(
      [
        this.restService.fetchComitionInterest(this.filters),
        this.restService.fetchCreditNumber(this.filters),
        this.restService.fetchInvestments(this.filters),
        this.restService.fetchLiquidity(this.filters)
      ]
    ).subscribe(observers => {
      this.dataComitionInterest = observers[0].data;
      this.dataCreditNumber = observers[1].data;
      this.dataInvestments = observers[2].data;
      this.dataLiquidity = observers[3].data;
      this.loading = false;
    });
  }

  filterCommission(data) {
    this.filters = data;
    this.fetchData();
  }

  exportPdf(idDiv) {
    this.loading = true;

    const self = this;

    const div = document.getElementById(idDiv);

    domtoimage.toPng(div).then((dataUrl) => {

      const doc = new jsPDF('l', 'mm', 'a4', 1);

      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (doc as any).getImageProperties(dataUrl);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(dataUrl, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      doc.save(idDiv + '.pdf');
      self.loading = false;
    });

  }

}
