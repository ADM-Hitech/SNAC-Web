import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { appAnimations } from '../../animations';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InvestorService } from 'src/app/main/modules/investor/investor.service';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-new-call-capital',
  templateUrl: './new-call-capital.component.html',
  styleUrls: ['./new-call-capital.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class NewCallCapitalComponent implements OnInit {

  public step = 1;
  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;
  public username: string;

  constructor(
    public dialogRef: MatDialogRef<NewCallCapitalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rest: InvestorService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formErrors = {
      amount: {},
      interest_rate: {},
      investment_horizon: {},
      bussiness_day: {},
      period_id: {},
      notice_mail: {},
      investor_id: {},
      default_interest: {},
      extension_day: {},
      password: {}
    };

    if (!!!data.periodics) {
      data.periodics = [];
    }

    this.username = localStorage.getItem('completeName');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      interest_rate: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      investment_horizon: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      bussiness_day: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      period_id: [1, Validators.required],
      notice_mail: [false],
      investor_id: [this.data.user.id ?? 0, Validators.required],
      default_interest: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      extension_day: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      password: ['', Validators.required]
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }

  private onLoginFormValuesChanged(): void {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      this.formErrors[field] = {};

      const control = this.formGroup.get(field);

      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  nextStep(): void {
    if (this.step === 2) {
      this.submit();
    }
    this.step = 2;
  }

  secondButton(): void {
    if (this.step === 1) {
      this.dialogRef.close();
    } else {
      this.step = 1;
    }
  }

  submit() {
    this.loading = true;
    this.rest.newCallCapital(this.formGroup.value).subscribe((response) => {
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

        this.dialogRef.close();
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
    }, (error) => {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR',
          subMessage: 'Error Server',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2500
      });
      this.loading = false;
    });
  }

}
