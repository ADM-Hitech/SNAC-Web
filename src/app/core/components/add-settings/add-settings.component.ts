import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { appAnimations } from '../../animations';
import { FondeoControlService } from '../../../main/modules/fondeo-control/fondeo-control.service';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-add-settings',
  templateUrl: './add-settings.component.html',
  styleUrls: ['./add-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class AddSettingsComponent implements OnInit {

  public step = 1;
  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    public dialogRef: MatDialogRef<AddSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private rest: FondeoControlService
  ) {
    this.formErrors = {
      settings: {},
      motivo: {},
      password: {}
    };
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      settings: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$')]],
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
    const periodic = this.data;
    periodic.reason = this.formGroup.get('motivo').value;
    periodic.promotional_setting = this.formGroup.get('settings').value;
    this.loading = true;

    this.rest.addSettings(periodic).subscribe((response: any) => {
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
