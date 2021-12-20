import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { WelcomeSnacComponent } from "src/app/core/components/welcome-snac/welcome-snac.component";
import { LoginService } from "../login.service";

@Component({
    selector: 'app-register-snac',
    templateUrl: './register-snac.component.html',
    styleUrls: ['./register-snac.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterSnacComponent {
    
    public registerForm: FormGroup;
    public loading: boolean = false;
    public companies: Array<any> = [];

    constructor(
        private readonly rest: LoginService,
        private readonly formBuild: FormBuilder,
        private readonly router: Router,
        private readonly snackBar: MatSnackBar
    ) {
        this.registerForm = this.formBuild.group({
            Name: ['', Validators.required],
            Lastname: ['', Validators.required],
            MLastname: ['', Validators.required],
            EmployeeNumber: ['', Validators.required],
            Curp: ['', Validators.required],
            CompanyId: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            Phone: ['', Validators.required]
        });

        this.getCompanies();
    }

    private getCompanies(): void {
        this.loading = true;
        this.rest.getCompanies().subscribe((response) => {
            if (response.success) {
                this.companies = response.data;
            }

            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    public submit(): void {
        this.loading = true;

        this.rest.requestRegister(this.registerForm.value).subscribe((response) => {
            if (response.success) {
                this.showAlert('Registro Exitoso', 'Tu registro fue enviado, pronto nos pondremos en contacto.', 'success');
                this.router.navigate(['/login']);
            } else {
                this.showAlert('Error Registro', 'Ocurrio un error, por favor intentalo mas tarde.', 'error');
            }

            this.loading = false;
        }, (err) => {
            this.loading = false;
        });
    }

    private showAlert(message: string, submessage: string, type: 'success' | 'error'): void {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
            data: {
              message: message,
              subMessage: submessage,
              type
            },
            panelClass: 'snack-message',
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 4000
        });
    }
}