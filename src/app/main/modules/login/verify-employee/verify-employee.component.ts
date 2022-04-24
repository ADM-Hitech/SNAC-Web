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
import { BinariaResponseModel } from "src/app/core/models/binaria-response.model";
import { CompleteUploadFilesComponent } from "src/app/core/components/comple-upload-files/comple-upload-files.component";

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
    private rfc: string;

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
                this.rfc = response.data.rfc;
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
        }, async err => {

            try {
                await this.rest.processRejectFile(err, this.advanceReq, this.showAlert, this.matDialog, this.loginForm.get('number').value);
            } catch( errs ){
                this.showAlert('ERROR', 'Ocurrio un error por favor intentelo mas marde', 'error');
            }

            if (!(err.status == 400 && err.error.rejectedFile)) {
                this.showAlert('ERROR', 'El usuario no fue encontrado o sus documentos ya fueron aprovados', 'error');
            }

            this.loading = false;
        });
    }

    private uploadSelfie(): void {
        const slefieDialog = this.matDialog.open(VerifySelfieComponent, {
            data: {
                service: this.rest
            }
        });

        slefieDialog.afterClosed().subscribe((response: BinariaResponseModel) => {
            this.showAlert('EXITOSO', 'La imagen se subio correctamente', 'success');
            this.selfie = new FaceDetectModal();
            this.selfie.URL1 = response.URL1;
            this.uploadIne();
        });
    }

    private uploadIne(): void {
        const ineDialog = this.matDialog.open(VerifyIneComponent, {
            data: {
                service: this.rest,
                curp: this.loginForm.get('number').value
            }
        });

        ineDialog.afterClosed().subscribe((response: Array<IneModel>) => {
            this.showAlert('EXITOSO', 'La imagen se subio correctamente', 'success');
            this.ine = response;
            const ine = response.find((ine) => !!(ine as IneFrontModel).curp);
            this.uploadStatusAccount((ine as IneFrontModel).curp, (ine as IneFrontModel).name, (ine as IneFrontModel).lastName);
        });
    }

    private uploadStatusAccount(rfc: string, names: string, lastName: string): void {
        const statusAccount = this.matDialog.open(VerifyAccountStatusComponent, {
            data: {
                service: this.rest,
                rfc: this.rfc ?? rfc,
                names,
                lastName
            }
        });

        statusAccount.afterClosed().subscribe((response) => {
            this.showAlert('EXITOSO', 'La imagen se subio correctamente', 'success');
            this.statusAccount = response;
            
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
                                this.advanceReq.syncSelfie(this.selfie, this.employeeId)
                            ]).subscribe((response) => {

                                this.advanceReq.completeUploadFiles(this.employeeId).subscribe((res) => {
                                    uploadingDialog.close();
                                    this.loading = false;

                                    this.showAlert('EXITOSO', 'Los documentos fueron enviados.', 'success');

                                    const dialogComplet = this.matDialog.open(CompleteUploadFilesComponent);

                                    dialogComplet.afterClosed().subscribe((response) => {
                                        this.router.navigate(['/login']);
                                    });
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

    private showAlert(message: string, submessage: string, type: 'success' | 'error' | 'warning'): void {
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