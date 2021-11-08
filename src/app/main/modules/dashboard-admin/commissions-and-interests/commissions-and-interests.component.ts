import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-commissions-and-interests',
  templateUrl: './commissions-and-interests.component.html',
  styleUrls: ['./commissions-and-interests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommissionsAndInterestsComponent implements OnInit {

  @Output() exportPdf = new EventEmitter<any>();
  @Output() filterChange = new EventEmitter<any>();
  @ViewChild('startDate') startDate: ElementRef;
  @ViewChild('endDate') endDate: ElementRef;
  visibleDates = false;
  specifiDate = false;
  filter = 'today';
  option = 'print';
  _data = null;
  single: Array<{
    name: string,
    series: Array<{
      name: string,
      value: number
    }>
  }> = [];
  promedioInteres: number;
  totalInteres: number;
  promedioComision: number;
  totalComision: number;
  colorScheme = {
    domain: ['#32379e', '#cacee6']
  };

  @Input() set data(data: any) {
    this._data = data;
    if (!!this._data) {
      this.parseData(this._data.commissionAndInterestByDays);
      this.promedioInteres = this._data.average_Interest;
      this.totalInteres = this._data.total_Interest;
      this.promedioComision = this._data.average_Commission;
      this.totalComision = this._data.total_Commission;
    }
  }

  constructor() {
    this.promedioInteres = 0;
    this.totalInteres = 0;
    this.promedioComision = 0;
    this.totalComision = 0;
  }

  ngOnInit(): void {}

  onSelect(event) { }

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
    else {
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
              name: 'interes',
              value: element.interest
            },
            {
              name: 'comision',
              value: element.commission
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
