import { Component, OnInit, ViewEncapsulation, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { DetailsInvesmentComponent } from '../../../../core/components/details-invesment/details-invesment.component';

@Component({
  selector: 'app-table-investments',
  templateUrl: './table-investments.component.html',
  styleUrls: ['./table-investments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableInvestmentsComponent implements OnInit {

  dataSource: Array<any> = [];
  columnsToDisplay: Array<any> = [
    'invertion',
    'principal',
    'interestRate',
    'payInteresRate',
    'periocidadPayment',
    'payInteresRatePrincipal',
    'initialDate',
    'endDate',
    'status',
    'details'
  ];

  @Input() set data(data: any) {
    this.dataSource = [...data];
  }
  @Input() totalRow: number;
  @Output() changePage: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  changeTable(event: any): void {
    this.changePage.emit(event);
  }

  details(childs: Array<any>, interestRate: number): void {
    this.dialog.open(DetailsInvesmentComponent, {
      data: {
        details: childs,
        name: localStorage.getItem('completeName'),
        interestRate
      }
    });
  }

}
