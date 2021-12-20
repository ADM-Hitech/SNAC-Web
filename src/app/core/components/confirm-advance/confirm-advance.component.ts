import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { forkJoin } from "rxjs";
import { RequestAdvanceService } from "src/app/main/modules/request-advance/request-advance.service";
import * as moment from 'moment';
import { PaySheetModel } from "../../models/pay-sheet.model";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-confirm-advance',
    templateUrl: './confirm-advance.component.html',
    styleUrls: ['./confirm-advance.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmAdvanceComponent {

    public loading: boolean = true;
    public amount: number = 0;
    public bank: string = '';
    public account: string = '**** **** **** 0000';
    public totalDiscount: number = 0;
    public dateDetails: Array<string> = [];
    public dayForPayment: number = 0;
    public comission: number = 0;
    public totalWithhold: number = 0;
    public totalWeek: number = 0;

    constructor(
        private dialogRef: MatDialogRef<ConfirmAdvanceComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: RequestAdvanceService,
            amount: number,
            paysheet: Array<PaySheetModel>
        },
        private readonly snackBar: MatSnackBar,
    ) {

        this.amount = this.data.amount;

        forkJoin([
            this.data.service.getInfoBank(),
            this.data.service.preAdvance(this.data.paysheet, this.amount)]
        ).subscribe((response) => {
            this.bank = response[0].data.user.institution_Name;
            this.account = '**** **** **** ' + (response[0].data.user.account_Number as string).slice(-4);
            this.totalDiscount = response[1].data.advance.total_Withhold;
            this.dateDetails = response[1].data.details.map((item) => moment(item.date_Payment).format('DD/MM/yyyy'));
            this.dayForPayment = response[1].data.advance.day_For_Payment;
            this.comission = response[1].data.advance.comission;
            this.totalWithhold = response[1].data.advance.total_Withhold;
            this.loading = false;

            if ((response[1].data.details as Array<any>).length > 0) {
                this.totalWeek = response[1].data.details[0].total_Payment;
            }
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

    public confirm(): void {
        this.dialogRef.close({
            dayForPayment: this.dayForPayment,
            comission: this.comission,
            totalWithhold: this.totalWithhold,
            dates: this.dateDetails,
            totalWeek: this.totalWeek
        });
    }
}