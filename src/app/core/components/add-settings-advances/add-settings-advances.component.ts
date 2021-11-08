import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { appAnimations } from '../../animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';
import { AdvancesReceivableService } from '../../../main/modules/advances-receivable/advances-receivable.service';

@Component({
  selector: 'app-add-settings-advances',
  templateUrl: './add-settings-advances.component.html',
  styleUrls: ['./add-settings-advances.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class AddSettingsAdvancesComponent implements OnInit {

  public step = 1;
  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    public dialogRef: MatDialogRef<AddSettingsAdvancesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      advance: any,
      isDetails: boolean,
      AccreditedId: number
    },
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private rest: AdvancesReceivableService
  ) {
    this.formErrors = {
      Advance_Id: {},
      Amount: {},
      motivo: {},
      password: {},
      Accredited_Id: {},
      Is_Details: {}
    };
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      Advance_Id: [this.data?.advance?.id, Validators.required],
      Is_Details: [this.data?.isDetails],
      Accredited_Id: [this.data?.AccreditedId],
      Amount: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]],
      motivo: ['', Validators.required],
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

  submit(): void {
    this.loading = true;

    this.rest.addSettings(this.formGroup.value).subscribe((response: any) => {
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

        this.dialogRef.close(response.data);
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
    }, error => {
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
