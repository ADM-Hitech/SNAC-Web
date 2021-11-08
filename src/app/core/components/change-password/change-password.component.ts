import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/main/modules/login/login.service';
import { Router } from '@angular/router';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordModalComponent implements OnInit {

  public recoveryForm: FormGroup;
  public loginFormErrors: any;
  public loading = false;
  public message = '';
  public noEquals = false;

  constructor(
    private rest: LoginService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
  ) {
    this.loginFormErrors = {
      password: {},
      confirmPassword: {}
    };
  }

  ngOnInit() {
    this.recoveryForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]]
    });

    this.recoveryForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }

  private onLoginFormValuesChanged(): void {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      this.loginFormErrors[field] = {};

      const control = this.recoveryForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }

      this.noEquals = false;

      if (field === 'confirmPassword') {
        if (this.recoveryForm.get('password').value !== this.recoveryForm.get(field).value) {
          this.loginFormErrors[field].noEqual = 'La contraseña no conincide';
          this.noEquals = true;
        }
      }
    }
  }

  public submit() {
    this.loading = true;
    this.recoveryForm.get('confirmPassword').disable();

    this.rest.changePassword(this.recoveryForm.value).subscribe((response: any) => {
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

        this.dialogRef.close(true);
        this.loading = false;
      },
      (error) => {
        this.message = 'Error al guardar la contraseña';
        this.loading = false;
      });
  }

}
