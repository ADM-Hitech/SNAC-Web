import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { appAnimations } from 'src/app/core/animations';
import { LicenseService } from '../license.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-license-funding-control',
  templateUrl: './license-funding-control.component.html',
  styleUrls: ['./license-funding-control.component.scss'],
  animations: appAnimations,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'MM/YYYY'
        },
        display: {

          dateInput: 'MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMM YYYY'
        }
      }
    }
  ]
})
export class LicenseFundingControlComponent implements OnInit {

  public date = new FormControl(_moment());
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public licenseId = 0;
  public keyaccount = '';
  public currentAmount = 0;
  public accountsReceivable = 0;
  public loading = false;
  private advance = [];

  constructor(private rest: LicenseService, private route: ActivatedRoute) {
    this.licenseId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.fetchFounding();
  }

  private fetchFounding(): void {
    this.loading = true;

    this.rest.fetchFounding(this.licenseId, this.date.value.year(), this.date.value.month() + 1).subscribe((response) => {
      this.dataSource.data = response.data.deposits;
      this.keyaccount = response.data.originatorAccount;
      this.currentAmount = response.data.saldo;
      this.accountsReceivable = response.data.accountsReceivable;
      this.advance = response.data.advances;

      this.loading = false;
    });
  }

  public chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  public chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
      const ctrlValue = this.date.value;
      ctrlValue.month(normlizedMonth.month());
      this.date.setValue(ctrlValue);
      datepicker.close();

      this.fetchFounding();
  }

  public get totalAdvances(): number {
    if (this.advance.length > 0) {
      return this.advance.reduce((prev, current) => prev + current.amount, 0);
    }
    return 0;
  }

  public get deposit(): number {
    if (this.dataSource.data.length > 0) {
      return this.dataSource.data.reduce((prev, current) => prev + current.monto, 0);
    }

    return 0;
  }

}
