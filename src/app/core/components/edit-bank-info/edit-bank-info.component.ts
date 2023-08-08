import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { HttpClient } from '@angular/common/http';
import { Constant } from "../../services/constant";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-edit-bank-info',
    templateUrl: './edit-bank-info.component.html',
    styleUrls: ['./edit-bank-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditBankInfoComponent implements OnInit {

    public form: FormGroup;
    public formErrors: any;
    public loading = false;
    public loadingInit = true;
    public institutions: Array<any> = [];

    constructor(
        private readonly dialogRef: MatDialogRef<EditBankInfoComponent>,
        private readonly formBuilder: FormBuilder,
        private readonly http: HttpClient,
        private readonly snackBar: MatSnackBar,
        private readonly constant: Constant,
        @Inject(MAT_DIALOG_DATA) public data: {
            id: number,
            institution_id: number,
            clabe: string,
            account_number: string
        }
    ) {
        this.formErrors = {
            institution_id: {},
            clabe: {},
            account_number: {}
        };

        this.form = this.formBuilder.group({
            id: [data.id],
            institution_id: [data?.institution_id, Validators.required],
            clabe: [data?.clabe, Validators.required],
            account_number: [data?.account_number]
        });
    }

    ngOnInit(): void {
        this.fetchBanks();
        this.form.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });
    }

    private onFormValuesChanged(): void {
        for (const field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
              continue;
            }
      
            this.formErrors[field] = {};
      
            const control = this.form.get(field);
      
            if (control && control.dirty && !control.valid) {
              this.formErrors[field] = control.errors;
            }
        }
    }

    private fetchBanks(): void {
        
        this.http.get(`${this.constant.api}Institutions/GetList`).subscribe((response: any) => {
            if (response.success) {
                this.institutions = response.data;
            }

            this.loadingInit = false;
        }, _ => this.loadingInit = false);
    }

    public submit(): void {
        this.loading = true;

        this.http.put(`${this.constant.api}Accrediteds/UpdateBankInfo`, this.form.value).subscribe((response: any) => {
            if (!response.success) {
                this.snackBar.openFromComponent(SnakBarAlertComponent, {
                    data: {
                        message: 'ERROR',
                        subMessage: 'Ocurrio un error por favor intentelo mas tarde.',
                        type: 'error'
                    },
                    panelClass: 'snack-message',
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2500
                });   
            } else {
                this.dialogRef.close(true);
            }

            this.loading = false;
        }, _ => {
            this.loading = false;

            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                    message: 'ERROR',
                    subMessage: 'Ocurrio un error por favor intentelo mas tarde.',
                    type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });
        });
    }
}