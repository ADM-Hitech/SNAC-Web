import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecoveryPasswordComponent implements OnInit {

  public recoveryForm: FormGroup;
  public loginFormErrors: any;
  public loading = false;
  public loginError = '';
  public rememberLogin: false;

  constructor(
    private rest: LoginService,
    private formBuilder: FormBuilder
  ) {
    this.loginFormErrors = {
      mail: {}
    };
  }

  ngOnInit() {
    this.recoveryForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
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
    }
  }

  public submit() {
    this.loading = true;
    this.rest.recoveryPassword(this.recoveryForm.value).subscribe(
      (response: any) => {
        if (response.success) {
          this.loginError = 'Se ha enviado a su correo la nueva contraseña';
        } else {
          this.loginError = response.message;
        }
        
        this.loading = false;
      },
      (error) => {
        this.loginError = 'Error al recuperar la contraseña';
        this.loading = false;
      });
  }

}
