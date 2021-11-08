import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { forkJoin } from "rxjs";
import { RequestAdvanceService } from "src/app/main/modules/request-advance/request-advance.service";
import * as moment from 'moment';

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

    constructor(
        private dialogRef: MatDialogRef<ConfirmAdvanceComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: RequestAdvanceService,
            amount: number
        }
    ) {

        this.amount = this.data.amount;

        forkJoin([this.data.service.getInfoBank(), this.data.service.preAdvance(this.amount)]).subscribe((response) => {
            this.bank = response[0].data.user.institution_Name;
            this.account = '**** **** **** ' + (response[0].data.user.account_Number as string).slice(-4);
            this.totalDiscount = response[1].data.advance.total_Withhold;
            this.dateDetails = response[1].data.details.map((item) => moment(item.date_Payment).format('DD/MM/yyyy'));

            this.loading = false;
        });
    }
}