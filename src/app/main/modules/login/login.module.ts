import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { LoginRouting } from './login.routing';
import { LoginService } from './login.service';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthComponent } from './auth/auth.component';
import { VerifyEmployeeComponent } from './verify-employee/verify-employee.component';
import { EmployeeNotFoundComponent } from './employee-not-found/employee-not-found.component';
import { RegisterSnacComponent } from './register-snac/register-snac.component';
import { EmailNotFoundComponent } from './email-not-found/email-not-found.component';


@NgModule({
  declarations: [
    LoginComponent,
    RecoveryPasswordComponent,
    ChangePasswordComponent,
    AuthComponent,
    VerifyEmployeeComponent,
    EmployeeNotFoundComponent,
    RegisterSnacComponent,
    EmailNotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoginRouting
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule { }
