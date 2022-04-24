import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { DownloadReportService } from "./download-report.service";

@Component({
    selector: 'app-download-report',
    templateUrl: './download-report.component.html',
    styleUrls: ['./download-report.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DownloadReportComponent {
    public form: FormGroup;
    public formErrors: any;
    public loading = false;

    constructor(
        private readonly rest: DownloadReportService,
        private readonly formBuild: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.formErrors = {
            NumberWeek: {},
            Password: {}
        };

        this.form = this.formBuild.group({
            NumberWeek: ['', Validators.required],
            Password: ['', Validators.required]
        });
    }

    public submit() {
        this.loading = true;

        this.rest.downloadReport(this.form.value).subscribe((response) => {
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = response.filename;
            a.click();
            this.loading = false;
        }, err => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'ERROR',
                  subMessage: 'Ocurrio un error, verifique la contraseña',
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

    public get periods() {
        return Array.from({ length: 54 }, (v, i) => i + 1);
    }

}