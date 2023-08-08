import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInput, MatSort, MatTableDataSource } from '@angular/material';
import { forkJoin } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PendingRecordService } from './pending-records.service';

@Component({
    selector: 'app-pending-records',
    templateUrl: './pending-records.component.html',
    styleUrls: ['./pending-records.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PendingRecordComponent implements OnInit{

    public dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public totalRow = 0;
    public loading = false;
    public lugaresTrabajoActivos: Array<any> = [];
    public filterControl = new FormControl();

    @ViewChild('Filter') filter: MatInput;

    constructor(private rest: PendingRecordService) {
        this.fetchPendingRecords();
    }

    ngOnInit(): void {
        this.filterControl.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
            this.onSearchChange(value);
        });
    }

    public fetchPendingRecords(page: number = 1, numrecord: number = 50, filter: string = ''): void {
        this.loading = true;

        forkJoin([
            this.rest.fetchAcrediteds(page, numrecord, filter),
            this.rest.getLugaresTrabajoActivos()    
        ]).subscribe((response) => {
            this.lugaresTrabajoActivos = response[1].data;
            this.dataSource.data = response[0].data.accrediteds.sort((a, b) => {
                const isactive = this.lugarIsActive(a.lugarTrabajo ?? '');
                if (isactive) {
                    return -1
                }

                if (!isactive) {
                    return 1;
                }

                return 0;
            });
            
            this.totalRow = response[0].data.totalRecord;
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    public changePage(event): void {
        this.fetchPendingRecords(event.pageIndex + 1, event.pageSize, '');
    }

    public lugarIsActive(value: string): boolean {
        return this.lugaresTrabajoActivos.findIndex(l => l.label.toLocaleLowerCase() == value.toLocaleLowerCase()) >= 0;
    }

    onSearchChange(data: string) {
        this.loading = true;

        this.rest.fetchAcrediteds(1, 20, data).subscribe((response) => {
            this.dataSource.data = response.data.accrediteds.sort((a, b) => {
                const isactive = this.lugarIsActive(a.lugarTrabajo ?? '');
                if (isactive) {
                    return -1
                }

                if (!isactive) {
                    return 1;
                }

                return 0;
            });
            
            this.totalRow = response.data.totalRecord;
            this.loading = false;
        }, (_) => {
            this.loading = false;
        });
    }
}
