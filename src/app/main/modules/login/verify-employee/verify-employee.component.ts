import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { UploadPayrollReceiptComponent } from "src/app/core/components/upload-payroll-receipt/upload-payroll-receipt.component";
import { VerifyAccountStatusComponent } from "src/app/core/components/verify-account-status/verify-account-status.component";
import { VerifyIneComponent } from "src/app/core/components/verify-ine/verify-ine.component";
import { VerifySelfieComponent } from "src/app/core/components/verify-selfie/verify-selfie.component";
import { WelcomeSnacComponent } from "src/app/core/components/welcome-snac/welcome-snac.component";
import { IneModel } from "src/app/core/models/ine-model";
import { IneFrontModel } from 'src/app/core/models/ine-front-model';
import { RequestAdvanceService } from "../../request-advance/request-advance.service";
import { LoginService } from "../login.service";
import { forkJoin } from "rxjs";
import { FaceDetectModal } from "src/app/core/models/face-detected-model";
import { AccountStatusModel } from "src/app/core/models/account-status.model";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { UploadingFilesComponent } from "src/app/core/components/uploading-files/uploading-files.component";
import { PaySheetModel } from "src/app/core/models/pay-sheet.model";
import { Router } from "@angular/router";
import { EditEmailComponent } from "src/app/core/components/edit-email/edit-email.component";
import { AvisoPrivacidadComponent } from "src/app/core/components/aviso-privacidad/aviso-privacidad.component";

@Component({
    selector: 'app-verify-employee',
    templateUrl: './verify-employee.component.html',
    styleUrls: ['./verify-employee.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerifyEmployeeComponent {

    public loginForm: FormGroup;
    public loading: boolean = false;
    public selfie: FaceDetectModal;
    public ine: Array<IneModel>;
    public statusAccount: AccountStatusModel;
    public payrollReceipt: Array<PaySheetModel>;
    private employeeId: number;

    constructor(
        private rest: LoginService,
        private formBuild: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly advanceReq: RequestAdvanceService,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router
    ) {
        this.loginForm = this.formBuild.group({
            number: ['', Validators.required]
        });
    }

    public initialProcess(): void {
        this.loading = true;

        this.rest.verifyEmployeeNumber(this.loginForm.get('number').value).subscribe(response => {
            if (response.success) {
                this.employeeId = response.data.id;
                const welcomeDialog = this.matDialog.open(WelcomeSnacComponent);

                welcomeDialog.afterClosed().subscribe((response) => {
                    this.uploadSelfie();
                });
            } else {
                this.loading = false;
                this.rest.prevError.next(response.message);
                this.rest.previewPage.next(true);
                this.router.navigate(['/login/not-found']);
            }
        }, err => {
            this.showAlert('ERROR', 'El usuario no fue encontrado o sus documentos ya fueron aprovados', 'error');
        });
    }

    private uploadSelfie(): void {
        const slefieDialog = this.matDialog.open(VerifySelfieComponent, {
            data: {
                service: this.rest
            }
        });

        slefieDialog.afterClosed().subscribe((response) => {
            this.showAlert('EXITOSO', 'La imagen se subio correctamente', 'success');
            this.selfie = response;
            this.uploadIne();
        });
    }

    private uploadIne(): void {
        const ineDialog = this.matDialog.open(VerifyIneComponent, {
            data: {
                service: this.rest
            }
        });

        ineDialog.afterClosed().subscribe((response: Array<IneModel>) => {
            this.showAlert('EXITOSO', 'La imagen se subio correctamente', 'success');
            this.ine = response;
            const ine = response.find((ine) => !!(ine as IneFrontModel).curp);
            this.uploadStatusAccount((ine as IneFrontModel).curp);
        });
    }

    private uploadStatusAccount(rfc: string): void {
        const statusAccount = this.matDialog.open(VerifyAccountStatusComponent, {
            data: {
                service: this.rest,
                rfc
            }
        });

        statusAccount.afterClosed().subscribe((response) => {
            this.showAlert('EXITOSO', 'La imagen se subio correctamente', 'success');
            this.statusAccount = response;
            this.uploadPayrollReceiptComponent(rfc);
        });
    }

    private uploadPayrollReceiptComponent(rfc: string): void {
        const payRollReceipt = this.matDialog.open(UploadPayrollReceiptComponent, {
            data: {
                service: this.advanceReq,
                rfc,
                onlyOne: true
            }
        });

        payRollReceipt.afterClosed().subscribe((response) => {
            var changeEmailDialog = this.matDialog.open(EditEmailComponent, {
                data: {
                    id: this.employeeId
                }
            });

            changeEmailDialog.afterClosed().subscribe((responseEmail) => {
                if (responseEmail) {

                    const dialogRef = this.matDialog.open(AvisoPrivacidadComponent);

                    dialogRef.afterClosed().subscribe((raviso) => {
                        if (typeof raviso == 'boolean' && (raviso as boolean)) {
                            const uploadingDialog = this.matDialog.open(UploadingFilesComponent);
                            uploadingDialog.disableClose = true;
                            this.payrollReceipt = response;
                            forkJoin([
                                this.advanceReq.syncIneAccredited(this.ine[0] as IneFrontModel, this.ine[1], this.employeeId),
                                this.advanceReq.syncStatusAccount(this.statusAccount, this.employeeId),
                                this.advanceReq.syncPaysheet(this.payrollReceipt, this.employeeId),
                                this.advanceReq.syncSelfie(this.selfie, this.employeeId)
                            ]).subscribe((response) => {

                                this.advanceReq.completeUploadFiles(this.employeeId).subscribe((res) => {
                                    uploadingDialog.close();
                                    this.loading = false;

                                    this.showAlert('EXITOSO', 'Los documentos fueron enviados.', 'success');
                                    this.router.navigate(['/login']);
                                }, err => {
                                    this.showAlert('ERROR', 'Ocurrio un error al procesar los archivos favor de intentarlo mas tarde', 'error');
                                });

                            }, err => {
                                this.showAlert('ERROR', 'Ocurrio un error al procesar los archivos favor de intentarlo mas tarde', 'error');
                            });
                        } else {
                            this.loading = false;
                        }
                    });
                }
            });
        });
    }

    private showAlert(message: string, submessage: string, type: 'success' | 'error'): void {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
            data: {
              message: message,
              subMessage: submessage,
              type
            },
            panelClass: 'snack-message',
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3300
        });
    }
}