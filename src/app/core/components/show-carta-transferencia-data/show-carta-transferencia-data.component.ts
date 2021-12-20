import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
import { Constant } from "../../services/constant";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-show-carta-transferencia-data',
    templateUrl: './show-carta-transferencia-data.component.html',
    styleUrls: ['./show-carta-transferencia-data.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShowCartaTransferenciaDataComponent implements OnInit {
    
    public loading: boolean = false;
    public htmlCarta: SafeHtml = '';
    public loadingCarta: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<ShowCartaTransferenciaDataComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            token: string
        },
        private constant: Constant,
        private sanitizer: DomSanitizer,
        private http: HttpClient,
        private rest: LoginService,
        private snackBar: MatSnackBar
    ) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.getHtml();
    }

    public accept(): void {
        this.loading = true;
        this.rest.acceptConvenioAndCartaDeAuthorizacion(this.data.token).subscribe((response) => {
            if (response.success) {
              localStorage.setItem('token', this.data.token);
              setTimeout(() => {
                this.dialogRef.close(true);
              }, 1500);
            } else {
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
            }

            this.loading = false;
          }, err => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
              data: {
                message: 'ERROR',
                subMessage: 'Ocurrio un error intentolo mas tarde',
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

    public cancel(): void {
        this.dialogRef.close(false);
    }
    
    private getHtml(): void {
        this.loadingCarta = true;
        const url = `${this.constant.api}Users/GetCartaTransferenciaDatosPersonales?token=${this.data.token}`;

        this.http.get(url, { responseType: 'text' }).subscribe(response => {
            this.htmlCarta = this.sanitizer.bypassSecurityTrustHtml(response);
            this.loadingCarta = false;
        }, err => {
            this.loadingCarta = false;
        });
    }
}