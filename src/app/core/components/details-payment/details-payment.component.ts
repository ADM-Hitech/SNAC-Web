import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-details-payment',
  templateUrl: './details-payment.component.html',
  styleUrls: ['./details-payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsPaymentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetailsPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  get totalPayPeriodo(): number {
    return (this.data.pay.subTotalPayNextDay + this.data.pay.iva) -
      (this.data.pay.retencionIva - this.data.pay.retencionISR) + this.data.pay.principalPay;
  }

  get interesPayBefore(): number {
    return (this.data.adeudo.subTotalPayNextDay + this.data.adeudo.iva) -
      (this.data.adeudo.retencionIva - this.data.adeudo.retencionISR);
  }

}
