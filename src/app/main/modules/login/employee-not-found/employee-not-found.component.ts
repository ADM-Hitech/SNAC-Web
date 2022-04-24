import { Component, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { AvisoPrivacidadComponent } from "src/app/core/components/aviso-privacidad/aviso-privacidad.component";
import { CompleteUploadFilesComponent } from "src/app/core/components/comple-upload-files/comple-upload-files.component";
import { EditEmailComponent } from "src/app/core/components/edit-email/edit-email.component";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { UploadPayrollReceiptComponent } from "src/app/core/components/upload-payroll-receipt/upload-payroll-receipt.component";
import { UploadingFilesComponent } from "src/app/core/components/uploading-files/uploading-files.component";
import { VerifyAccountStatusComponent } from "src/app/core/components/verify-account-status/verify-account-status.component";
import { VerifyIneComponent } from "src/app/core/components/verify-ine/verify-ine.component";
import { VerifySelfieComponent } from "src/app/core/components/verify-selfie/verify-selfie.component";
import { WelcomeSnacComponent } from "src/app/core/components/welcome-snac/welcome-snac.component";
import { AccountStatusModel } from "src/app/core/models/account-status.model";
import { BinariaResponseModel } from "src/app/core/models/binaria-response.model";
import { FaceDetectModal } from "src/app/core/models/face-detected-model";
import { IneFrontModel } from "src/app/core/models/ine-front-model";
import { IneModel } from "src/app/core/models/ine-model";
import { PaySheetModel } from "src/app/core/models/pay-sheet.model";
import { RequestAdvanceService } from "../../request-advance/request-advance.service";
import { LoginService } from "../login.service";

@Component({
    selector: 'app-employee-not-found',
    templateUrl: './employee-not-found.component.html',
    styleUrls: ['./employee-not-found.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmployeeNotFoundComponent {

    public verifyForm: FormGroup;
    public loading: boolean = false;
    private employeeId: number;
    public selfie: FaceDetectModal;
    public ine: Array<IneModel>;
    public statusAccount: AccountStatusModel;
    public payrollReceipt: Array<PaySheetModel>;
    public message = 'No encontramos tu CURP en nuesta base de datos, verifica que esté correcto. O modificalo en caso de un error.';
    public hideButton: boolean = false;
    public showEmail: boolean = false;
    public prevEmail: string = '';
    private rfc: string;

    constructor(
        private rest: LoginService,
        private formBuil: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly advanceReq: RequestAdvanceService,
        private readonly snackBar: MatSnackBar,
        private readonly router: Router
    ) {
        this.verifyForm = this.formBuil.group({
            curp: [this.rest.prevCurp.value || '', Validators.required],
            email: [{ value: '', disable: true }]
        });

        this.proccessError();
    }

    public proccessError(): void {
        if ((this.rest.prevError.value || '').includes('estén aprobados')) {
            this.message = 'Nuestro equipo se encuentra validando tu información. En cuanto terminemos recibirás un correo con tu usuario y Contraseña.';
            this.hideButton = true;
        }

        if ((this.rest.prevError.value || '').includes('ya puedes iniciar')) {
            const splitEmail = this.rest.prevError.value.split(':');
            const emial = splitEmail[splitEmail.length - 1];
            this.verifyForm.get('email').enable();
            this.verifyForm.get('email').setValue((emial || '').trim());
            this.verifyForm.get('email').setValidators([Validators.required, Validators.email]);
            this.prevEmail = (emial || '').trim();
            this.showEmail = true;
            this.hideButton = true;
            this.message = 'Ya hemos validado correctamente tu información y enviado tu usuario y contraseña al correo que indicaste. Por favor verifica que no lo hayas recibido en "no deseados" o en SPAM y verifica que este correo sea el correcto o danos otro correo para enviarte tu usuario y contraseña';
        }
    }

    public initialProcess(): void {
        this.loading = true;
        this.rest.verifyEmployeeNumber(this.verifyForm.get('curp').value).subscribe(response => {
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

                setTimeout(() => {
                    this.proccessError();
                }, 500);

                this.showAlert('ERROR', response.message, 'error');
            }
        }, async err => {
            try {
                await this.rest.processRejectFile(err, this.advanceReq, this.showAlert, this.matDialog, this.verifyForm.get('curp').value);
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
                curp: this.verifyForm.get('curp').value
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

    public getFielForm(field: string): AbstractControl {
        return this.verifyForm.get(field);
    }

    public updateEmail(): void {
        this.verifyForm.get('email').enable();
        this.loading = true;
        this.rest.updateEmail(this.verifyForm.value).subscribe((response) => {
            if (response.success) {
                this.showAlert('EXITOSO', 'Su email fue actualizado, enviaremos nuevamente sus credenciales', 'success');
                this.rest.prevCurp.next('');
                this.rest.prevError.next('');
                this.router.navigate(['/login']);

                return;
            }

            this.showAlert('ERROR', response.message, 'error');
            this.loading = false;
        }, err => {
            this.showAlert('ERROR', 'Ocurrio un error, favor de intentarlo mas tarde', 'error');
            this.loading = false;
        });
    }
}