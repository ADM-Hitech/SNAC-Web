import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { LicenseService } from './license.service';

@Component({
    selector: 'app-licenses',
    templateUrl: './licenses.component.html',
    styleUrls: ['./licenses.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LicensesComponent {

    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public totalRow = 0;
    public loading = false;

    constructor(private licenseService: LicenseService) {
        this.fetchLicense();
    }

    private fetchLicense(page: number = 1, numrecord: number = 50, filter: string = ''): void {
        this.loading = true;

        this.licenseService.fetchLicenses(page, numrecord, filter).subscribe((response) => {
            this.dataSource.data = response.data.data;
            this.totalRow = response.data.totalRecord;
            this.loading = false;
        });
    }

    public changePage(event): void {
        this.fetchLicense(event.pageIndex + 1, event.pageSize, '');
    }
}
