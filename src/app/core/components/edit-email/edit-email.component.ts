import { HttpClient } from "@angular/common/http";
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { Constant } from "../../services/constant";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-edit-email',
    templateUrl: './edit-email.component.html',
    styleUrls:['./edit-email.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditEmailComponent {

    public formGroup: FormGroup;
    public loading = false;

    constructor(
        private dialogRef: MatDialogRef<EditEmailComponent>,
        private formBuilder: FormBuilder,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private constant: Constant,
        @Inject(MAT_DIALOG_DATA) private data: {
            id: number
        }
    ) {
        this.dialogRef.disableClose = true;
        this.formGroup = this.formBuilder.group({
            email: ['', [Validators.email, Validators.required]],
            accreditedId: [this.data.id]
        });
    }

    submit(): void {
        this.loading = true;

        this.http.put(`${this.constant.api}Login/ChangeEmail`, this.formGroup.value).subscribe((response: any) => {
            if (response.success) {
                this.dialogRef.close(true);

                return;
            }

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

            this.loading = false;
        }, err => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                    message: 'ERROR',
                    subMessage: 'Ocurrio un error inesperado',
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