import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
import { FaceDetectModal } from "../../models/face-detected-model";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { Constant } from "../../services/constant";
import { Utils } from "../../utils";

@Component({
	selector: 'app-verify-selfie',
	templateUrl: './verify-selfie.component.html',
	styleUrls: ['./verify-selfie.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class VerifySelfieComponent implements AfterViewInit, OnInit {

	@ViewChild('boxInput') boxInput: ElementRef;
	@ViewChild('inputFile') inputFile: ElementRef;
	public uploadingSelfie: boolean = false;
	public hubConnection: HubConnection;

	constructor(
		private dialogRef: MatDialogRef<VerifySelfieComponent>,
		@Inject(MAT_DIALOG_DATA) private data: {
			service: LoginService
		},
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private snackBar: MatSnackBar,
		private constant: Constant
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

	ngOnInit(): void {}

	ngAfterViewInit() {
		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('click', (event) => {
			(this.inputFile.nativeElement as HTMLInputElement).click();
		});

		(this.inputFile.nativeElement as HTMLInputElement).addEventListener('change', (event) => {
			this.deleteDefaultEvent(event);
			const files = (event.target as HTMLInputElement).files;
			if (files.length > 0) {
				const fileReader = new FileReader();

				fileReader.onload = (e) => {
					this.uploadingSelfie = true;

					this.data.service.uploadSelfie(fileReader.result.toString()).subscribe((response) => {
						this.uploadSelfie(response, files[0]);
					}, err => {
						this.uploadingSelfie = false;
						this.snackBar.openFromComponent(SnakBarAlertComponent, {
							data: {
								message: 'ERROR',
								subMessage: 'Error al procesar el archivo, o no se encontro un rostro',
								type: 'error'
							},
							panelClass: 'snack-message',
							horizontalPosition: 'right',
							verticalPosition: 'top',
							duration: 2500
						});

					}, () => this.uploadingSelfie = false);
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
					this.uploadingSelfie = true;

					this.data.service.uploadSelfie(fileReader.result.toString()).subscribe((response) => {
						this.uploadSelfie(response, files[0]);
					}, err => {
						this.uploadingSelfie = false;
						this.snackBar.openFromComponent(SnakBarAlertComponent, {
							data: {
								message: 'ERROR',
								subMessage: 'Error al procesar el archivo, o no se encontro un rostro',
								type: 'error'
							},
							panelClass: 'snack-message',
							horizontalPosition: 'right',
							verticalPosition: 'top',
							duration: 2500
						});
					}, () => this.uploadingSelfie = false);
				};

				fileReader.readAsDataURL(files[0]);
			}
		});
	}

	private deleteDefaultEvent(event: DragEvent | any): void {
		event.preventDefault();
		event.stopPropagation();
	}

	private uploadSelfie(response: Array<any>, file: File): void {
		let face: FaceDetectModal;

		if (response.length > 0) {
			var first: Array<any> = response[0];

			if (first.length > 0) {
				face = FaceDetectModal.fromJson(first[0]);
				face.file = file;
			}
		}

		this.dialogRef.close(face);
	}

}