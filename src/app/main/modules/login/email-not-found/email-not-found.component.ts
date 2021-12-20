import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { LoginService } from "../login.service";

@Component({
    selector: 'app-email-not-found',
    templateUrl: './email-not-found.component.html',
    styleUrls: ['./email-not-found.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmailNotFoundComponent {

    public form: FormGroup;
    public loading: boolean = false;

    constructor(
        private readonly rest: LoginService,
        private readonly formBuild: FormBuilder,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router
    ) {
        this.form = this.formBuild.group({
            Email: ['', [Validators.email, Validators.required]],
            Curp: ['', Validators.required]
        });
    }

    public submit(): void {
        this.loading = true;

        this.rest.emailNotFound(this.form.value).subscribe((response) => {
            if (response.success) {
                this.showAlert('EXITOSO', 'Tu Solicitud fue enviada', 'success');
                this.router.navigate(['/login']);
            } else {
                this.showAlert('ERROR', 'Ocurrio un error, intentalo mas tarde', 'error');
            }

            this.loading = false;
        }, err => {
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
            duration: 3300
        });
    }
}