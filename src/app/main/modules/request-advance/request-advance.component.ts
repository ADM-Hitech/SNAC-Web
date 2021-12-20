import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material";
import * as moment from "moment";
import { appAnimations } from "src/app/core/animations";
import { ConfirmAdvanceComponent } from "src/app/core/components/confirm-advance/confirm-advance.component";
import { NewAdvanceComponent } from "src/app/core/components/new-advance/new-advance.component";
import { ShowCartaMandatoComponent } from "src/app/core/components/show-carta-mandato/show-carta-mandato.component";
import { UploadPayrollReceiptComponent } from "src/app/core/components/upload-payroll-receipt/upload-payroll-receipt.component";
import { PaySheetModel } from "src/app/core/models/pay-sheet.model";
import { RequestAdvanceService } from "./request-advance.service";

@Component({
    selector: 'app-request-advance',
    templateUrl: './request-advance.component.html',
    styleUrls: ['./request-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: appAnimations
})
export class RequestAdvanceComponent implements OnInit {
    public data: Array<any> = [];
    public loading: boolean = false;
    public totalRow: number = 0;
    public nextDatePayment = moment();

    constructor(
        private readonly service: RequestAdvanceService,
        private readonly matDialog: MatDialog
    ) {
        let dayWeek: number = this.nextDatePayment.weekday();
        let date = this.nextDatePayment;

        if (dayWeek === 0) {
            dayWeek = 7;
        }

        if (dayWeek < 6) {
            this.nextDatePayment = this.nextDatePayment.add(5 - dayWeek, 'days');
        } else if (dayWeek === 6) {
            this.nextDatePayment = this.nextDatePayment.add(6, 'days');
        } else if (dayWeek === 7) {
            this.nextDatePayment = this.nextDatePayment.add(5, 'days');
        }
    }

    public ngOnInit(): void {
        this.getAdvances();
    }

    private getAdvances(): void {
        this.loading = true;
        this.service.getMyAdvances().subscribe((response) => {
            const before = response?.data?.befores ?? [];
            const currents = response?.data?.currents ?? [];
            this.data = before.concat(currents);
        }, (err) => {}, () => {
            this.loading = false;
        });
    }

    private newRequest(paysheet: Array<PaySheetModel>): void {
        const dialog = this.matDialog.open(NewAdvanceComponent, {
            data: {
                service: this.service,
                paysheet
            }
        });

        dialog.afterClosed().subscribe((response) => {
            if (response?.amount && response.amount > 0) {
                this.confirmRequest(response.amount, paysheet);
            }
        });
    }

    private confirmRequest(amount: number, paysheet: Array<PaySheetModel>): void {
        const dialog = this.matDialog.open(ConfirmAdvanceComponent, {
            data: {
                service: this.service,
                amount,
                paysheet
            }
        });

        dialog.afterClosed().subscribe((response) => {
            console.log(response);
            if (!(typeof response === 'boolean' && !(response as boolean))) {
                this.showCarta(response, amount, paysheet);
            }
        });
    }

    private showCarta(data: {
        dayForPayment: number,
        comission: number,
        totalWithhold: number,
        dates: Array<string>,
        totalWeek: number
    }, amount: number, paysheet: Array<PaySheetModel>): void {
        const dialog = this.matDialog.open(ShowCartaMandatoComponent, {
            data: {
                advance: {
                    amount: amount,
                    dayForPayment: data.dayForPayment,
                    comission: data.comission,
                    totalWithhold: data.totalWithhold,
                    dates: data.dates,
                    totalWeek: data.totalWeek
                },
                service: this.service,
                paysheet
            }
        });

        dialog.afterClosed().subscribe((response) => {
            this.getAdvances();
        });
    }

    public uploadPayrollReceipt(): void {
        const dialog = this.matDialog.open(UploadPayrollReceiptComponent, {
            data: {
                service: this.service
            }
        });

        dialog.afterClosed().subscribe((response: Array<PaySheetModel> | boolean) => {
            if (typeof response != 'boolean') {
                this.newRequest(response);
            }
        });
    }

    public get totalToPay(): number {
        return this.data.reduce((sum, advance) => sum + advance.details.filter(detail => moment(detail.detail.date_Payment).format('DD/MM/YYYY') == this.nextDatePayment.format('DD/MM/YYYY')).reduce((sum2, detail) => sum2 + detail.detail.total_Payment, 0), 0);
    }
}