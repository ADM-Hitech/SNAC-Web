import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
import { Address } from "../../models/address.model";
import { IneFrontModel } from "../../models/ine-front-model";
import { IneModel } from "../../models/ine-model";
import { GoogleService } from "../../services/google.service";
import { Utils } from "../../utils";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-very-ine',
    templateUrl: './verify-ine.component.html',
    styleUrls: ['./verify-ine.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerifyIneComponent implements AfterViewInit {

    @ViewChild('boxInput') boxInput: ElementRef;
	@ViewChild('inputFile') inputFile: ElementRef;
    public type: 'front' | 'back' = 'front';
	public uploadingINE: boolean = false;
    public completeINE: Array<IneModel> = [];

    constructor(
        private dialogRef: MatDialogRef<VerifyIneComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: LoginService,
			curp: string | null
        },
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private snackBar: MatSnackBar,
		private googleService: GoogleService
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
					this.uploadingINE = true;

					this.data.service.uploadIne(fileReader.result.toString(), this.type).subscribe((response) => {
						this.uploadIne(response, files[0]);
					}, err => {
						this.uploadingINE = false;
						this.snackBar.openFromComponent(SnakBarAlertComponent, {
							data: {
								message: 'ERROR',
								subMessage: 'Error al procesar el archivo, o su ine es invalida',
								type: 'error'
							},
							panelClass: 'snack-message',
							horizontalPosition: 'right',
							verticalPosition: 'top',
							duration: 2500
						});

					}, () => this.uploadingINE = false);
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
					this.uploadingINE = true;

					this.data.service.uploadIne(fileReader.result.toString(), this.type).subscribe((response) => {
						this.uploadIne(response, files[0]);
					}, err => {
						this.uploadingINE = false;
						this.snackBar.openFromComponent(SnakBarAlertComponent, {
							data: {
								message: 'ERROR',
								subMessage: 'Error al procesar el archivo, o su ine es invalida',
								type: 'error'
							},
							panelClass: 'snack-message',
							horizontalPosition: 'right',
							verticalPosition: 'top',
							duration: 2500
						});
					}, () => this.uploadingINE = false);
				};

				fileReader.readAsDataURL(files[0]);
			}
		});
    }

    private deleteDefaultEvent(event: DragEvent | any): void {
		event.preventDefault();
		event.stopPropagation();
	}

    private async uploadIne(response: any, file: File): Promise<void> {
        let ine: IneModel;

        if (this.type === 'front') {
            ine = IneFrontModel.fromJson(response);

			if (typeof this.data.curp === 'string') {
				if ((this.data.curp as any).replaceAll(' ', '').toLocaleLowerCase() !== ((ine as IneFrontModel).curp as any).replaceAll(' ', '').toLocaleLowerCase()) {
					this.snackBar.openFromComponent(SnakBarAlertComponent, {
						data: {
							message: 'ERROR',
							subMessage: 'La CURP no coincide, por favor intente nuevamente y procure que la imagen salga clara.',
							type: 'error'
						},
						panelClass: 'snack-message',
						horizontalPosition: 'right',
						verticalPosition: 'top',
						duration: 4000
					});

					return;
				}
			}

			const restgoogle = await this.googleService.getGeoPosition((ine as IneFrontModel).address).toPromise();

			(ine as IneFrontModel).addressDetail = Address.fromGoogleService(restgoogle);

            this.type = 'back';
        } else {
            ine = IneModel.fromJson(response);
        }

		ine.file = file;

        this.completeINE.push(ine);

        if (this.completeINE.length === 2) {
            this.dialogRef.close(this.completeINE);
        }
    }
}