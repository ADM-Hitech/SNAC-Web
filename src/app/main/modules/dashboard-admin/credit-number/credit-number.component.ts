import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-credit-number',
  templateUrl: './credit-number.component.html',
  styleUrls: ['./credit-number.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreditNumberComponent implements OnInit {

  @Output() exportPdf = new EventEmitter<any>();
  @ViewChild('startDate') startDate: ElementRef;
  @ViewChild('endDate') endDate: ElementRef;
  visibleDates = false;
  specifiDate = false;
  @Output() filterChange = new EventEmitter<any>();
  filter = 'today';
  option = 'print';
  _data = null;
  single: Array<{name: string, value: number}> = [];
  promedioCredit: number;
  totalCredit: number;
  montoPromedioAdvance: number;
  colorScheme = {
    domain: ['#32379e']
  };

  @Input() set data(data: any) {
    this._data = data;
    if (!!this._data) {
      this.parseData(this._data.creditAvarageDetails);
      this.promedioCredit = this._data.credit_Average;
      this.totalCredit = this._data.total_Credit;
      this.montoPromedioAdvance = this._data.amount_Average;
    }
  }

  constructor() {
    this.promedioCredit = 0;
    this.totalCredit = 0;
    this.montoPromedioAdvance = 0;
  }

  ngOnInit(): void {
  }

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

  onSelect(event) {}

  public parseData(data: Array<any>) {
    this.single.splice(0, this.single.length);
    data.forEach(element => {
      this.single.push(
        {
          name: moment(element.date).format('DD/MM/YY'),
          value: element.amount
        }
      );
    });

    this.single = [...this.single];
  }

  exportFile(name) {
    this.exportPdf.emit(name);
  }
}
