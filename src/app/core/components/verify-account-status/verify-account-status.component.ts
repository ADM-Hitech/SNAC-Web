import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
import { AccountStatusModel } from "../../models/account-status.model";
import { AuthService } from "../../services/auth/auth.service";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-verify-account-status',
    templateUrl: './verify-account-status.component.html',
    styleUrls: ['./verify-account-status.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerifyAccountStatusComponent implements AfterViewInit {

    @ViewChild('boxInput') boxInput: ElementRef;
	@ViewChild('inputFile') inputFile: ElementRef;
    public uploadingStatusAccount: boolean = false;
    
    constructor(
        private dialogRef: MatDialogRef<VerifyAccountStatusComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: LoginService,
			rfc: string | undefined
        },
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private snackBar: MatSnackBar,
        private auth: AuthService
    ) {
        this.dialogRef.disableClose = true;

        this.matIconRegistry.addSvgIcon(
			'uploadPayRollReceipt',
			this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-recibo-nomina.svg')
		);

		this.matIconRegistry.addSvgIcon(
			'logoUpload',
			this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-subir-archivo.svg')
		);   
    }

    ngAfterViewInit(): void {
        (this.boxInput.nativeElement as HTMLDivElement).addEventListener('click', (event) => {
			(this.inputFile.nativeElement as HTMLInputElement).click();
		});

		(this.inputFile.nativeElement as HTMLInputElement).addEventListener('change', (event) => {
			this.deleteDefaultEvent(event);
			const files = (event.target as HTMLInputElement).files;
			if (files.length > 0) {
				const fileReader = new FileReader();

				fileReader.onload = (e) => {
					this.uploadingStatusAccount = true;

					this.data.service.uploadStatusAccount(fileReader.result.toString()).subscribe((response) => {
						this.uploadAccountStatus(response, files[0]);
					}, err => {
						this.uploadingStatusAccount = false;
						this.snackBar.openFromComponent(SnakBarAlertComponent, {
							data: {
								message: 'ERROR',
								subMessage: 'Error al procesar el archivo, o su estado de cuenta no es valida',
								type: 'error'
							},
							panelClass: 'snack-message',
							horizontalPosition: 'right',
							verticalPosition: 'top',
							duration: 2500
						});

					}, () => this.uploadingStatusAccount = false);
				};

				fileReader.readAsDataURL(files[0]);
			}
		});

		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('drag', (event) => {
			this.deleteDefaultEvent(event);
		});
		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragstart', (event) => {
			this.deleteDefaultEvent(event);
		});
		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragend', (event) => {
			this.deleteDefaultEvent(event);
		});
		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragover', (event) => {
			this.deleteDefaultEvent(event);
		});
		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragenter', (event) => {
			this.deleteDefaultEvent(event);
		});
		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragleave', (event) => {
			this.deleteDefaultEvent(event);
		});

		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('drop', (event) => {
			this.deleteDefaultEvent(event);
			const files = event.dataTransfer.files;
			if (files.length > 0) {
				const fileReader = new FileReader();

				fileReader.onload = (e) => {
					this.uploadingStatusAccount = true;

					this.data.service.uploadStatusAccount(fileReader.result.toString()).subscribe((response) => {
						this.uploadAccountStatus(response, files[0]);
					}, err => {
						this.uploadingStatusAccount = false;
						this.snackBar.openFromComponent(SnakBarAlertComponent, {
							data: {
								message: 'ERROR',
								subMessage: 'Error al procesar el archivo, o su estado de cuenta no es valida',
								type: 'error'
							},
							panelClass: 'snack-message',
							horizontalPosition: 'right',
							verticalPosition: 'top',
							duration: 2500
						});
					}, () => this.uploadingStatusAccount = false);
				};

				fileReader.readAsDataURL(files[0]);
			}
		});
    }

    private deleteDefaultEvent(event: DragEvent | any): void {
		event.preventDefault();
		event.stopPropagation();
	}

    private uploadAccountStatus(response: any, file: File): void {
        const accountStatus: AccountStatusModel = AccountStatusModel.fromJson(response);
		accountStatus.file = file;
		const rfc = this.data.rfc || this.auth.rfc;

        if (rfc.substring(0, rfc.length > 7 ? 8 : 0).toLowerCase() !== accountStatus.rfc.substring(0, accountStatus.rfc.length > 7 ? 8 : 0).toLowerCase()) {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                    message: 'ERROR',
                    subMessage: 'El documento tiene un rfc distinto al del usuario',
                    type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });

            return;
        }

        this.dialogRef.close(accountStatus);
    }
}