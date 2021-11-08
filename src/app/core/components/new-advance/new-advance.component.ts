import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { RequestAdvanceService } from "src/app/main/modules/request-advance/request-advance.service";

@Component({
    selector: 'app-new-advance',
    templateUrl: './new-advance.component.html',
    styleUrls: ['./new-advance.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewAdvanceComponent {

    public form: FormGroup;
    public maxAmount: number = 0;

    constructor(
        private dialogRef: MatDialogRef<NewAdvanceComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: RequestAdvanceService
        },
        private readonly snackBar: MatSnackBar,
        private formBuild: FormBuilder
    ) {
        this.form = this.formBuild.group({
            amount: [{ value: 0, disabled: false }, Validators.min(1)]
        });

        console.log(this.form);

        this.data.service.calculateAdvance().subscribe((response) => {
            this.maxAmount = response;
        });
    }

    public request(): void {
        this.dialogRef.close({
            amount: this.form.get('amount').value
        });
    }
}