import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public loginFormErrors: any;
  public loading = false;
  public loginError = '';

  constructor(
    private rest: LoginService,
    private formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private cookieService: CookieService
  )
  {
    this.loginFormErrors = {
      mail: {},
      password: {},
      rememberLogin: {}
    };

    this.matIconRegistry.addSvgIcon(
      'logoCandado',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-candado.svg')
    );
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberLogin: [false]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });

    const emaiEncript = this.cookieService.get('auid');

    if (!!emaiEncript) {
      const bytes = CryptoJS.AES.decrypt(emaiEncript, 'pqekey');
      this.loginForm.get('mail').setValue(bytes.toString(CryptoJS.enc.Utf8));
      this.loginForm.get('rememberLogin').setValue(true);
    }
  }

  private onLoginFormValuesChanged(): void {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      this.loginFormErrors[field] = {};

      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  public submit() {
    this.loginError = '';
    this.loading = true;

    const login = {
      mail: this.loginForm.get('mail').value,
      password: this.loginForm.get('password').value
    };

    this.rest.login(login,
      this.loginForm.get('rememberLogin').value as boolean).subscribe((response: {success: boolean, type: number, firstLogin: boolean}) => {
      if (response.success) {

        if (response.firstLogin) {
          this.router.navigate(['/login/change-password']);
        } else {
          if (response.type === 2) {
            this.router.navigate(['/investment']);
          } else if (response.type === 3) {
            this.router.navigate(['/solicitar-adelanto']);
          }else {
            this.router.navigate(['/dashboard']);
          }
        }
      } else {
        this.loginError = 'El usuario o contraseña son incorrectos';
      }

      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  public changePassword(): void {
    window.open('https://pliis.mx/web_app/#/olvidePassw');
  }

}
