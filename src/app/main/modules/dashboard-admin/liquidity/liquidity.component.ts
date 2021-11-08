import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LiquidityComponent implements OnInit {

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
  promedioCapitalTotalComprometido: number;
  capitalTotalComprometido: number;
  callsPromedyCapital: number;
  totalCallsCapital: number;
  promedioCapitalUso: number;
  totalCapitalUso: number;
  _data = null;
  colorScheme = {
    domain: ['#cacee6', '#2865ff', '#32379e']
  };

  @Input() set data(data: any) {
    this._data = data;
    if (!!this._data) {
      this.parseData(this._data.liquidityDetails);
      this.capitalTotalComprometido = this._data.commited_Capital;
      this.promedioCapitalTotalComprometido = this._data.average_Capital;
      this.totalCallsCapital = this._data.call_Capital;
      this.callsPromedyCapital = this._data.average_Call_Capital;
      this.promedioCapitalUso = this._data.average_Advances;
      this.totalCapitalUso = this._data.total_Advances;
    }
  }

  constructor() {
    this.promedioCapitalTotalComprometido = 0;
    this.capitalTotalComprometido = 0;
    this.callsPromedyCapital = 0;
    this.totalCallsCapital = 0;
    this.promedioCapitalUso = 0;
    this.totalCapitalUso = 0;
  }

  ngOnInit(): void {
  }

  onChange(event) {
    this.filter = event.value;
    this.specifiDate = false;
    this.visibleDates = false;
    if (event.value === 'range-dates' || event.value === 'specific-day') {
      this.visibleDates = true;
      this.specifiDate = event.value === 'range-dates';
    } else {
      this.filterChange.emit({ filter: event.value });
    }
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

  parseData(data: Array<any>) {
    this.single.splice(0, this.single.length);
    data.forEach(element => {
      this.single.push({
        name: moment(element.date).format('DD/MM/YY'),
        series: [
          {
            name: 'Capital total',
            value: element.amount_Capital
          },
          {
            name: 'Llamadas de capital',
            value: element.amount_Call_Capital
          },
          {
            name: 'Capital en uso',
            value: element.amount_Advance
          }
        ]
      });
    });

    this.single = [...this.single];
  }

  exportFile(name) {
    this.exportPdf.emit(name);
  }
}
