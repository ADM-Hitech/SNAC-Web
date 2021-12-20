import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { appAnimations } from 'src/app/core/animations';

@Component({
    selector: 'app-table-movements',
    templateUrl: './table-movements.component.html',
    styleUrls: ['./table-movements.component.scss'],
    animations: appAnimations,
    encapsulation: ViewEncapsulation.None
})
export class TableMovementComponent {

    public columnsToDisplay = [
        'accredited',
        'amount',
        'date',
        'status'
    ];
    @Input() totalRow: number;
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();

    @Output() changePage: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    public changeTable(event: any): void {
        this.changePage.emit(event);
    }

}
