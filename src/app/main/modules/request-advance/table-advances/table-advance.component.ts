import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
    selector: 'app-table-advance',
    templateUrl: './table-advance.component.html',
    styleUrls: ['./table-advance.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TableAdvanceComponent {

    public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    public columnsToDisplay: Array<string> = [
        'folio',
        'date',
        'amount',
        'date_payment',
        'commission',
        'interes',
        'vat',
        'total'
    ];

    @Input() set data(data: Array<any>) {
        this.dataSource = new MatTableDataSource(data);
    }
    @Input() totalRow: number;

    @Output() changePage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(private readonly dialog: MatDialog) {}

    public changeTable(event: any): void {
        this.changePage.emit(event);
    }
}