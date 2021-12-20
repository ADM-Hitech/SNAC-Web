import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-table-founding',
  templateUrl: './table-founding.component.html',
  styleUrls: ['./table-founding.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableFoundingComponent implements OnInit {

  public columnsToDisplay = [
    'claveRastreo',
    'dateTransaction',
    'monto',
    'estado',
  ];

  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor() { }

  ngOnInit() {
  }

}
