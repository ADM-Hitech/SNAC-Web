import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material";
import { appAnimations } from "src/app/core/animations";
import { ConfirmAdvanceComponent } from "src/app/core/components/confirm-advance/confirm-advance.component";
import { NewAdvanceComponent } from "src/app/core/components/new-advance/new-advance.component";
import { UploadPayrollReceiptComponent } from "src/app/core/components/upload-payroll-receipt/upload-payroll-receipt.component";
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

    constructor(
        private readonly service: RequestAdvanceService,
        private readonly matDialog: MatDialog
    ) {}

    public ngOnInit(): void {
        this.loading = true;
        this.service.getMyAdvances().subscribe((response) => {
            this.data = response?.data?.befores ?? [];
        }, (err) => {}, () => {
            this.loading = false;
        });
    }

    public newRequest(): void {
        const dialog = this.matDialog.open(NewAdvanceComponent, {
            data: {
                service: this.service
            }
        });

        dialog.afterClosed().subscribe((response) => {
            if (response?.amount && response.amount > 0) {
                this.confirmRequest(response.amount);
            }
        });
    }

    private confirmRequest(amount: number): void {
        const dialog = this.matDialog.open(ConfirmAdvanceComponent, {
            data: {
                service: this.service,
                amount
            }
        });
    }

    public uploadPayrollReceipt(): void {
        const dialog = this.matDialog.open(UploadPayrollReceiptComponent, {
            data: {
                service: this.service
            }
        });
    }
}