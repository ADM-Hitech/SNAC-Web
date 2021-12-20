import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter, MatDatepicker } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { appAnimations } from 'src/app/core/animations';
import { AccountStatusLicenseService } from './account-status-license.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {  Moment } from 'moment';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-account-status-license',
    templateUrl: './account-status-license.component.html',
    styleUrls: ['./account-status-license.component.scss'],
    animations: appAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {
          provide: MAT_DATE_FORMATS, useValue: {
            parse: {
              dateInput: 'MM/YYYY'
            },
            display: {
              dateInput: 'MM/YYYY',
              monthYearLabel: 'MMM YYYY',
              dateA11yLabel: 'LL',
              monthYearA11yLabel: 'MMMM YYYY'
            }
          }
        }
    ]
})
export class AccountStatusLicenseComponent {

    public licensePriceRange: Array<any> = [];
    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public totalRow = 0;
    public loading = false;
    public licenseId = 0;
    public totalForOperation = 0;
    public comition = 3.5;
    public date = new FormControl(_moment());

    public currentPage = 1;
    public currentNumRecord = 50;

    constructor(private restService: AccountStatusLicenseService, private route: ActivatedRoute) {
        this.licenseId = this.route.snapshot.params.licenseid;

        this.fetchMovement();
    }

    private fetchMovement(
        page: number = 1,
        numrecord: number = 50,
        filter: string = '',
        year: number = 0,
        month: number = 0
    ): void {
        this.currentPage = page;
        this.currentNumRecord = numrecord;

        this.loading = true;

        if (year === 0) {
            year = this.date.value.year();
        }

        if (month === 0) {
            month = this.date.value.month() + 1;
        }

        this.restService.fetchMovement(page, numrecord, filter, this.licenseId, year, month).subscribe((response) => {
            this.loading = false;
            this.dataSource.data = response.data.data;
            this.totalRow = response.data.totalRecord;

            if (this.licensePriceRange.length >= 0) {
                this.fetchLicensePriceRange();
            }
        });
    }

    public changePage(event): void {
        this.fetchMovement(event.pageIndex + 1, event.pageSize, '');
    }

    private fetchLicensePriceRange(): void {
        this.restService.fetchLicensePriceRange(this.licenseId).subscribe((response) => {
            this.licensePriceRange = response.data;

            const cost = this.licensePriceRange.filter(
            (price) => this.totalRow >= price.initialQuantity && this.totalRow <= price.finalQuantity).sort((a, b) => {
                if (a.licenseId > b.licenseId) {
                    return -1;
                }

                if (a.licenseId < b.licenseId) {
                    return 1;
                }

                return 0;
            });

            if (cost.length > 0) {
                this.totalForOperation = cost[0].cost;
            }
        });
    }

    public get priceUnit(): number {
        return ((this.totalForOperation ?? 1) / (this.totalRow ?? 1));
    }

    public get total(): number {
        return (this.totalForOperation + this.comition) * 1.16;
    }

    chosenYearHandler(normalizedYear: Moment) {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
    }

    chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normlizedMonth.month());
        this.date.setValue(ctrlValue);
        datepicker.close();

        this.fetchMovement(this.currentPage, this.currentNumRecord);
    }
}
