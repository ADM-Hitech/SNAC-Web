import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
import { FaceDetectModal } from "../../models/face-detected-model";

import { Constant } from "../../services/constant";
import { BinariaService } from "../../services/binaria.service";
import { BinariaResponseModel } from "../../models/binaria-response.model";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
	selector: 'app-verify-selfie',
	templateUrl: './verify-selfie.component.html',
	styleUrls: ['./verify-selfie.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class VerifySelfieComponent implements OnInit, OnDestroy {
	public hubConnectionId: string = '';
	public iframeUrl: SafeResourceUrl;
	public subcriptionTime: any;

	constructor(
		private dialogRef: MatDialogRef<VerifySelfieComponent>,
		@Inject(MAT_DIALOG_DATA) private data: {
			service: LoginService
		},
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private snackBar: MatSnackBar,
		private constant: Constant,
		private binariaService: BinariaService
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

	ngOnInit(): void {
		var refreshIntervalId = setInterval(() => {
			this.hubConnectionId = this.binariaService.hubConnnectionIdSubcription.value;

			if (this.hubConnectionId) {
				clearInterval(refreshIntervalId);
				this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(`https://identityverify.azurewebsites.net/facialIdentity/id/${this.hubConnectionId}/keyws/${this.constant.tokenBinariaFace}`);
			}
		}, 500);

		this.onSubscription();
	}

	private onSubscription(): void {
		this.subcriptionTime = setInterval(() => {
			console.log('refresh iframe..');
		}, 1000);

		this.binariaService.responseSubcription.subscribe((data: BinariaResponseModel) => {
			if (data !== null && data.IsIdentical) {
				this.dialogRef.close(data);
				console.log('.');
			} else if (data !== null) {
				this.showAlert('Error', 'Error al comparar las imagenes, procure de mirar de frente a la camara con una buena iluminación', 'error');
			}
		});
	}

	ngOnDestroy(): void {
		this.binariaService.responseSubcription.next(null);
		clearInterval(this.subcriptionTime);
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
            duration: 4500
        });
    }

}