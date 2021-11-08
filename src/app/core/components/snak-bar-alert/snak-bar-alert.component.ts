import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snak-bar-alert',
  templateUrl: './snak-bar-alert.component.html',
  styleUrls: ['./snak-bar-alert.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SnakBarAlertComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<SnakBarAlertComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: {
      message: string,
      subMessage: string,
      type: 'success' | 'warning' | 'error'
    }
  ) {
    this.data.message = !!this.data.message ? this.data.message : 'Message';
    this.data.subMessage = !!this.data.subMessage ? this.data.subMessage : '';
    this.data.type = !!this.data.type ? this.data.type : 'success';
  }

  ngOnInit() {
  }

}
