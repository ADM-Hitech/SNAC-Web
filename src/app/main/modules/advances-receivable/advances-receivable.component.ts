import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AdvancesReceivableService } from './advances-receivable.service';
import { MatInput } from '@angular/material';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advances-receivable',
  templateUrl: './advances-receivable.component.html',
  styleUrls: ['./advances-receivable.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancesReceivableComponent implements OnInit {

  public data: Array<any> = [];
  public loading: boolean;
  @ViewChild('Filter') filter: MatInput;
  public filterControl = new FormControl();
  public licenseId = 0;

  constructor(
    private rest: AdvancesReceivableService,
    private route: ActivatedRoute
  ) {
    this.loading = false;
    this.licenseId = this.route.snapshot.params.licenseid;
  }

  ngOnInit(): void {
    this.fetchData();
    this.filterControl.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.onSearchChange(value);
      });
  }

  fetchData(filter: string = ''): void {
    this.loading = true;

    this.rest.fetchData(filter, this.licenseId).subscribe((response) => {
      this.loading = false;
      if (response.success) {
        this.data = response.data;
      }
    }, (error) => {
      this.loading = false;
    });
  }

  onSearchChange(data: string) {
    this.fetchData(data);
  }

  exportFile(type): void {
    this.loading = true;
    this.rest.fetchFile(type).subscribe(result => {
      this.loading = false;
      const url = window.URL.createObjectURL(result.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = result.filename;
      a.click();
    });
  }

}
