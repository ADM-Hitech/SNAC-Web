import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { RequestAdvanceService } from "src/app/main/modules/request-advance/request-advance.service";
import { PaySheetModel } from "../../models/pay-sheet.model";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-new-advance',
    templateUrl: './new-advance.component.html',
    styleUrls: ['./new-advance.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewAdvanceComponent {

    public form: FormGroup;
    public maxAmount: number = 0;
    public loading: boolean = true;

    constructor(
        private dialogRef: MatDialogRef<NewAdvanceComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: RequestAdvanceService,
            paysheet: Array<PaySheetModel>
        },
        private readonly snackBar: MatSnackBar,
        private formBuild: FormBuilder
    ) {
        this.form = this.formBuild.group({
            amount: [{ value: 0, disabled: false }, Validators.min(1)]
        });

        this.data.service.calculateAdvance(this.data.paysheet).subscribe((response) => {
            this.maxAmount = response;
            this.loading = false;
        }, err => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'ERROR',
                  subMessage: err.message,
                  type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 3500
            });

            this.loading = false;
            this.dialogRef.close(false);
        });
    }

    public request(): void {
        this.dialogRef.close({
            amount: this.form.get('amount').value
        });
    }
}