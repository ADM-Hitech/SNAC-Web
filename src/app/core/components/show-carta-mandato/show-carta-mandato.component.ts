import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { RequestAdvanceService } from "src/app/main/modules/request-advance/request-advance.service";
import { PaySheetModel } from "../../models/pay-sheet.model";
import { AuthService } from "../../services/auth/auth.service";
import { Constant } from "../../services/constant";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-show-carta-mandato',
    templateUrl: './show-carta-mandato.component.html',
    styleUrls: ['./show-carta-mandato.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShowCartaMandatoComponent {

    public loading: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<ShowCartaMandatoComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            advance: {
                amount: number,
                dayForPayment: number,
                comission: number,
                totalWithhold: number,
                dates: Array<string>,
                totalWeek: number
            },
            service: RequestAdvanceService,
            paysheet: Array<PaySheetModel>
        },
        private snacBar: MatSnackBar,
        private constant: Constant,
        private auth: AuthService,
        private sanitizer: DomSanitizer
    ) {
        this.dialogRef.disableClose = true;
    }

    public get urlCarta(): SafeUrl {
        const token = localStorage.getItem('token');
        let complement = `&amount=${this.data.advance.amount}&days=${this.data.advance.dayForPayment}&commision=${this.data.advance.comission}&totalAmount=${this.data.advance.totalWithhold}&totalWeek=${this.data.advance.totalWeek}`;
        
        if (this.data.advance.dates.length > 0) {
            const dates = this.data.advance.dates.join(",");
            complement = `${complement}&dates=${dates}`;
        }

        const url = `${this.constant.api}Users/GetCartaMandato?token=${token}${complement}`;

        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    public accept(): void {
        this.loading = true;

        this.data.service.requestAdvance(this.data.advance.amount, this.data.paysheet).subscribe((response) => {
            this.loading = false;
            if (response.success) {
                this.dialogRef.close(true);
                this.snacBar.openFromComponent(SnakBarAlertComponent, {
                    data: {
                      message: 'EXITOSO',
                      subMessage: 'Se ha realizado la solicitud correctamente.',
                      type: 'success'
                    },
                    panelClass: 'snack-message',
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2500
                });
            } else {
                this.dialogRef.close(false);
                this.snacBar.openFromComponent(SnakBarAlertComponent, {
                    data: {
                      message: 'ERROR',
                      subMessage: response.message,
                      type: 'error'
                    },
                    panelClass: 'snack-message',
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 3500
                });
            }
        }, err => {
            this.loading = false;
            this.dialogRef.close(false);
            this.snacBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'ERROR',
                  subMessage: 'Ocurrio un error intentalo mas tarde.',
                  type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 3500
            });
        });
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}