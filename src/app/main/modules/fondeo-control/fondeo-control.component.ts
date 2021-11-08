import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FondeoControlService } from './fondeo-control.service';
import { MatInput } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-fondeo-control',
  templateUrl: './fondeo-control.component.html',
  styleUrls: ['./fondeo-control.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FondeoControlComponent implements OnInit {

  public fondeControls: Array<any> = [];
  public loading = false;
  public totalRow = 0;
  @ViewChild('Filter') filter: MatInput;
  public detailsTotals = {
    subTotalPayNextDay: 0,
    iva: 0,
    retencionIva: 0,
    retencionISR: 0,
    interestNetoPerPay: 0,
    principalPay: 0,
    totalPayPeriodo: 0,
  };

  public detailsTotalsAdeudo = {
    subTotalPayNextDay: 0,
    iva: 0,
    retencionIva: 0,
    retencionISR: 0,
    interestNetoPerPay: 0,
    total: 0,
  };

  public filterControl = new FormControl();

  constructor(
    private rest: FondeoControlService
  ) { }

  ngOnInit(): void {
    this.filterControl.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.onSearchChange(value);
      });
    this.fetchData();
  }

  fetchData(page: number = 1, numRecord: number = 20, filter: string = ''): void {
    this.loading = true;

    this.rest.fechData(page, numRecord, filter).subscribe((response) => {
      if (response.success) {
        this.fondeControls = response.data.anchorControls;
        this.totalRow = response.data.totalRecord;
        this.detailsTotals.subTotalPayNextDay = response.data.totals.interest;
        this.detailsTotals.iva = response.data.totals.vat;
        this.detailsTotals.retencionIva = response.data.totals.vat_Retention;
        this.detailsTotals.retencionISR = response.data.totals.isr_Retention;
        this.detailsTotals.interestNetoPerPay = response.data.totals.net_Interest;
        this.detailsTotals.principalPay = response.data.totals.principal_Payment;
        this.detailsTotals.totalPayPeriodo = response.data.totals.total_Period;

        this.detailsTotalsAdeudo.subTotalPayNextDay = response.data.totals.moratorium_Interest_Total;
        this.detailsTotalsAdeudo.iva = response.data.totals.moratorium_Vat;
        this.detailsTotalsAdeudo.retencionIva = response.data.totals.moratorium_Vat_Retention;
        this.detailsTotalsAdeudo.retencionISR = response.data.totals.moratorium_Isr_Retention;
        this.detailsTotalsAdeudo.interestNetoPerPay = response.data.totals.moratorium_Net_Interest;
        this.detailsTotalsAdeudo.total = response.data.totals.total_Anchor_Period;
      }

      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  exportFile(type): void {
    this.loading = true;
    this.rest.fetchFile(type).subscribe(result => {
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

  onSearchChange(data: string) {
    this.fetchData(1, 20, data);
  }

  changePage(event): void {
    this.fetchData(event.pageIndex + 1, event.pageSize, this.filter.value);
  }

}
