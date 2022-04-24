import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { LoginService } from "src/app/main/modules/login/login.service";
import { AccountStatusModel } from "../../models/account-status.model";
import { AuthService } from "../../services/auth/auth.service";
import { Utils } from "../../utils";
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
	public institutions: Array<any> = [];
    public uploadingStatusAccount: boolean = false;
	public institutionId: number;
	public loading = true;
    
    constructor(
        private dialogRef: MatDialogRef<VerifyAccountStatusComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: LoginService,
			rfc: string | undefined,
			names: string | undefined,
			lastName: string | undefined
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

		this.getInstitutions();
    }

	private getInstitutions(): void {
		this.data.service.getInstitutions().subscribe((response) => {
			this.institutions = response.data;

			this.loading = false;
		});
	}

    ngAfterViewInit(): void {
        (this.boxInput.nativeElement as HTMLDivElement).addEventListener('click', (event) => {
			(this.inputFile.nativeElement as HTMLInputElement).click();
		});

		(this.inputFile.nativeElement as HTMLInputElement).addEventListener('change', (event) => {
			this.deleteDefaultEvent(event);
			const files = (event.target as HTMLInputElement).files;
			if (files.length > 0) {
				const validType = Utils.typeFile(files[0].type);
				if (!validType) {
					this.snackBar.openFromComponent(SnakBarAlertComponent, {
					data: {
						message: 'ERROR',
						subMessage: 'El formato del archivo no es valido',
						type: 'error'
					},
					panelClass: 'snack-message',
					horizontalPosition: 'right',
					verticalPosition: 'top',
					duration: 2500
					});

					return;
				}
				const fileReader = new FileReader();

				fileReader.onload = (e) => {
					this.sendBinaria(fileReader, files[0]);
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
				const validType = Utils.typeFile(files[0].type);
				if (!validType) {
					this.snackBar.openFromComponent(SnakBarAlertComponent, {
					data: {
						message: 'ERROR',
						subMessage: 'El formato del archivo no es valido',
						type: 'error'
					},
					panelClass: 'snack-message',
					horizontalPosition: 'right',
					verticalPosition: 'top',
					duration: 2500
					});

					return;
				}
				
				const fileReader = new FileReader();

				fileReader.onload = (e) => {
					this.sendBinaria(fileReader, files[0]);
				};

				fileReader.readAsDataURL(files[0]);
			}
		});
    }

    private deleteDefaultEvent(event: DragEvent | any): void {
		event.preventDefault();
		event.stopPropagation();
	}

	private sendBinaria(fileReader: FileReader, file: File): void {
		this.uploadingStatusAccount = true;

		const institutionActive = this.institutions.find((item) => item.id === this.institutionId);

		if (!institutionActive) {
			this.snackBar.openFromComponent(SnakBarAlertComponent, {
				data: {
					message: 'ALERTA',
					subMessage: 'Seleccione un banco',
					type: 'warning'
				},
				panelClass: 'snack-message',
				horizontalPosition: 'right',
				verticalPosition: 'top',
				duration: 2500
			});

			this.uploadingStatusAccount = false;

			return;
		}

		this.data.service.uploadStatusAccount(fileReader.result.toString(), institutionActive.description).subscribe((response) => {
			this.uploadAccountStatus(response, file);
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
	}

    private uploadAccountStatus(response: any, file: File): void {
        const accountStatus: AccountStatusModel = AccountStatusModel.fromJson(response);
		accountStatus.institutionId = this.institutionId;
		accountStatus.file = file;
		const rfc = this.data.rfc || this.auth.rfc;
		const date = moment();

		if (typeof accountStatus.date2 == undefined) {
			this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                    message: 'ERROR',
                    subMessage: 'El documento no es del ultimo periodo',
                    type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });

			return;
		}

		var difDays = accountStatus.date2.diff(date, 'days');
		difDays = difDays > 0 ? difDays : (difDays * -1);

		if (difDays > 120) {
			this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                    message: 'ERROR',
                    subMessage: 'El documento no es del ultimo periodo',
                    type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });

			return;
		}

		if (accountStatus.rfc == '') {

			const name = this.data.names.split(' ');
			const lastName = this.data.lastName.split(' ');
			const validName = name.length > 0 && accountStatus.name.toLocaleLowerCase().includes(name[0].toLocaleLowerCase());
			const validLastName = lastName.length > 0 && accountStatus.name.toLocaleLowerCase().includes(lastName[0].toLocaleLowerCase());

			if (!(validName && validLastName)) {
				this.snackBar.openFromComponent(SnakBarAlertComponent, {
					data: {
						message: 'ERROR',
						subMessage: 'El documento tiene el nombre distinto al del usuario',
						type: 'error'
					},
					panelClass: 'snack-message',
					horizontalPosition: 'right',
					verticalPosition: 'top',
					duration: 2500
				});

				return;
			}

		} else if (accountStatus.rfc.toLocaleUpperCase() != 'XAXX010101000' && rfc.substring(0, rfc.length > 7 ? 8 : 0).toLowerCase() !== accountStatus.rfc.substring(0, accountStatus.rfc.length > 7 ? 8 : 0).toLowerCase()) {
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