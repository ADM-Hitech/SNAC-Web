import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentsComponent implements OnInit {

  @ViewChild('startDate') startDate: ElementRef;
  @ViewChild('endDate') endDate: ElementRef;
  visibleDates = false;
  specifiDate = false;
  @Output() exportPdf = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<any>();
  filter = 'today';
  option = 'print';
  single: Array<{
    name: string,
    series: Array<{
      name: string,
      value: number
    }>
  }> = [];
  promedioInteresPayed: number;
  totalInteresPayed: number;
  promedioPrincipal: number;
  totalPrincipal: number;
  _data = null;
  colorScheme = {
    domain: ['#cacee6', '#32379e']
  };

  @Input() set data(data: any) {
    this._data = data;
    if (!!this._data) {
      this.parseData(this._data.investmentDashboardDetails);
      this.promedioInteresPayed = this._data.average_Interest_Paid;
      this.totalInteresPayed = this._data.interest_Paid;
      this.promedioPrincipal = this._data.average_Main_Return;
      this.totalPrincipal = this._data.main_Return;
    }
  }

  constructor() {
    this.promedioInteresPayed = 0;
    this.totalInteresPayed = 0;
    this.promedioPrincipal = 0;
    this.totalPrincipal = 0;
  }

  ngOnInit(): void {
  }

  onSelect(event) {}

  changeDate() {
    if (this.filter === 'range-dates') {
      if (this.endDate.nativeElement.value.length > 0) {
        this.filterChange.emit({
          filter: this.filter,
          start_date: moment(this.startDate.nativeElement.value).format('yyyy-MM-DD'),
          end_date: moment(this.endDate.nativeElement.value).format('yyyy-MM-DD')
        });
      }
    }
    else {
      this.filterChange.emit({
        filter: this.filter,
        start_date: moment(this.startDate.nativeElement.value).format('yyyy-MM-DD'),
        Is_Specifid_Day: true
      });
    }
  }

  onChange(event) {
    this.filter = event.value;
    this.specifiDate = false;
    this.visibleDates = false;
    if (event.value === 'range-dates' || event.value === 'specific-day') {
      this.visibleDates = true;
      this.specifiDate = event.value === 'range-dates';
    }
    else{
      this.filterChange.emit({ filter: event.value });
    }
  }

  parseData(data: Array<any>) {
    this.single.splice(0, this.single.length);
    data.forEach(element => {
      this.single.push(
        {
          name: moment(element.date).format('DD/MM/YY'),
          series: [
            {
              name: 'Interes',
              value: element.interest_Paid
            },
            {
              name: 'Retorno principal',
              value: element.main_Return
            }
          ]
        }
      );
    });

    this.single = [...this.single];
  }

  exportFile(name) {
    this.exportPdf.emit(name);
  }
}
