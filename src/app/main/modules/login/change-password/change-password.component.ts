import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {

  public recoveryForm: FormGroup;
  public loginFormErrors: any;
  public loading = false;
  public message = '';
  public noEquals = false;

  constructor(
    private rest: LoginService,
    private formBuilder: FormBuilder,
    private router: Router
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

    this.rest.changePassword(this.recoveryForm.value).subscribe(
      async (response: any) => {
        if (response.success) {
          await this.rest.logAuth();
          this.router.navigate(['/login']);
        } else {
          this.message = response.message;
        }
      },
      (error) => {
        this.message = 'Error al guardar la contraseña';
        this.loading = false;
      });
  }

}
