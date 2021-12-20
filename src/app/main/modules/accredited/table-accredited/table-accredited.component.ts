import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { EditAccreditedComponent } from '../../../../core/components/edit-accredited/edit-accredited.component';
import { MatDialog, MatPaginator } from '@angular/material';
import { DetailsAdvancesAcreditedComponent } from '../../../../core/components/details-advances-acredited/details-advances-acredited.component';

@Component({
  selector: 'app-table-accredited',
  templateUrl: './table-accredited.component.html',
  styleUrls: ['./table-accredited.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableAccreditedComponent implements OnInit {

  dataSource = [];
  columnsToDisplay = [
    'options',
    'id',
    'name',
    'address',
    'colony',
    'municipality',
    'zip_code',
    'state',
    'company',
    'typeContract',
    'numberCotrato',
    'salary',
    'payPeriodicity',
    'interestRate',
    'interestMora',
    'rfc',
    'curp',
    'employeeNumber',
    'bank',
    'code',
    'numberAcount',
    'sex',
    'birthday',
    'oldYears',
    'position',
    'oldCompany',
  ];

  @Input() set data(data: any) {
    this.dataSource = [...data];
  }

  @Input() totalRow: number;
  @Input() banks: Array<any> = [];
  @Input() generos: Array<any> = [];
  @Input() companies: Array<any> = [];
  @Input() periodos: Array<any> = [];
  @Input() typeContracts: Array<any> = [];
  @Input() licenses: Array<any> = [];
  @Output() changePage: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventDelete: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    const element = document.getElementById('contentTable');
    element.addEventListener('scroll', (event) => {
      document.getElementById('cname').setAttribute('left', '114px');
    });
  }

  edit(item: any): void {
    const dialogRef = this.dialog.open(EditAccreditedComponent, {
      data: {
        user: item,
        banks: this.banks,
        generos: this.generos,
        companies: this.companies,
        periodos: this.periodos,
        typeContracts: this.typeContracts,
        licenses: this.licenses
      },
      panelClass: 'edit-accredited-modal'
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.changePage.emit({
          pageIndex: 0,
          pageSize: 20
        });
      }
    });
  }

  changeTable(event: any): void {
    this.changePage.emit(event);
  }

  delete(id: number, type: number): void {
    this.eventDelete.emit({
      id,
      type
    });
  }

  showDetailsAcredited(user: any): void {
    this.dialog.open(DetailsAdvancesAcreditedComponent, {
      data: {
        user: {
          name: `${user.first_Name} ${user.last_Name}`,
          interestRate: user.interest_Rate,
          companyName: user.company_Name,
          id: user.id
        },
        advances: user.advances
      }
    });
  }

}
