import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InvestmentsService } from './investments.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestmentsComponent implements OnInit {

  public data: Array<any> = [];
  public totalRow = 0;
  public loading = false;

  constructor(private rest: InvestmentsService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(page: number = 1, numrecord: number = 20): void {
    this.loading = true;

    this.rest.fetchData(page, numrecord).subscribe((response) => {
      if (response.success) {
        this.data = response.data.myInvestments;
        this.totalRow = response.data.totalRecord;
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  changePage(event): void {
    this.fetchData(event.pageIndex + 1, event.pageSize);
  }

}
