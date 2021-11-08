import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../services/constant';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-pay-company',
  templateUrl: './pay-company.component.html',
  styleUrls: ['./pay-company.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PayCompanyComponent implements OnInit {
  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    public dialogRef: MatDialogRef<PayCompanyComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private constant: Constant,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formErrors = {
      amount: {}
    };

    this.formGroup = this.formBuilder.group({
      amount: [{
        value: data?.totalAmount,
        disabled: true
      }, [Validators.required, Validators.pattern('^\\d+([.]\\d+)*$'), Validators.min(1)]],
      ispartial: [false],
      company_id: [data?.company_id],
      advanceIds: ['']
    });
  }

  ngOnInit() {
  }

  submit(): void {
    this.loading = true;
    this.formGroup.get('advanceIds').setValue(this.data.advanceIds);
    this.formGroup.get('amount').enable();

    this.http.post(`${this.constant.api}Advances/SetPaidAdvance`, this.formGroup.value).subscribe((response: any) => {
      if (response.success) {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
          data: {
            message: 'EXITOSO',
            subMessage: response.message,
            type: 'success'
          },
          panelClass: 'snack-message',
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2500
        });
      } else {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
          data: {
            message: 'ERROR',
            subMessage: response.message,
            type: 'error'
          },
          panelClass: 'snack-message',
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2500
        });
      }
      this.loading = false;
      this.dialogRef.close(true);
    }, error => {
      this.loading = false;
      this.dialogRef.close(true);
    });
  }

  changePartial(value: any): void {
    if (value.checked) {
      this.formGroup.get('amount').enable();
    } else {
      this.formGroup.get('amount').disable();
      this.formGroup.get('amount').setValue(this.data.totalAmount);
    }
  }

}
