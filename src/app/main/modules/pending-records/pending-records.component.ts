import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { PendingRecordService } from './pending-records.service';
import * as moment from 'moment';

@Component({
    selector: 'app-pending-records',
    templateUrl: './pending-records.component.html',
    styleUrls: ['./pending-records.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PendingRecordComponent {

    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public totalRow = 0;
    public loading = false;

    constructor(private rest: PendingRecordService) {
        this.fetchPendingRecords();
    }

    public fetchPendingRecords(page: number = 1, numrecord: number = 50, filter: string = ''): void {
        this.loading = true;

        this.rest.fetchAcrediteds(page, numrecord, filter).subscribe(response => {
            console.log(response);
            this.dataSource.data = response.data.accrediteds;
            this.totalRow = response.data.totalRecord;
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    public changePage(event): void {
        this.fetchPendingRecords(event.pageIndex + 1, event.pageSize, '');
    }
}
