import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
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
	public erroCamera: boolean = false;
	public uploadingFile: boolean = false;
	private canvas: HTMLCanvasElement;
	private video: HTMLVideoElement;

	constructor(
		private dialogRef: MatDialogRef<VerifySelfieComponent>,
		@Inject(MAT_DIALOG_DATA) private data: {
			service: LoginService
		},
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
		private snackBar: MatSnackBar
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
		this.initialStream();
	}

	ngOnDestroy(): void {
		if (this.video) {
			this.video.pause();
			this.video.src = "";
			this.video.srcObject = null;
		}
	}

	private initialStream(): void {
		let streaming = false;
		this.canvas = document.getElementById('camera') as HTMLCanvasElement;
		this.video = document.getElementById('video') as HTMLVideoElement;
		const widthBody = document.body.clientWidth;
		let width = 350;
		let height = 0;

		this.video.addEventListener('canplay', function(ev) {
			if (!streaming) {
				height = this.videoHeight / (this.videoWidth / width);
				this.setAttribute('width', widthBody > 500 ? width.toString() : '100%');
				this.setAttribute('height', height.toString());
				streaming = true;
			}
		}, false);
		
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		}).then(stream => {
			this.video.srcObject = stream;
			this.video.play();
			(window as any).stream = stream;
		}, (_err) => {
			this.erroCamera = true;
			this.showAlert('Permisos', 'Es necesario dar permisos de camara!!!', 'error');
		});
	}

	public takePicture(): void {
		this.uploadingFile = true;
		this.canvas.width = 342 * 3;
		this.canvas.height = 262 * 3;
		this.canvas.getContext('2d').drawImage(this.video, 0, 0, 342 * 3, 262 * 3);

		const blobcustom = this.dataURLtoBlob(this.canvas.toDataURL());

		if (this.video) {
			this.video.pause();
			this.video.src = "";
			this.video.srcObject = null;

			try {
				(window as any).stream.getTracks().forEach(function(track) {
					track.stop();
				});	
			} catch (_) {}
		}

		setTimeout(() => {
			this.uploadingFile = false;
			this.dialogRef.close(new File([blobcustom], "cap_1.jpg", {
				lastModified: Date.now(),
				type: 'image/jpg'
			}));
		}, 1500);
	}

	private dataURLtoBlob(dataUrl: string): Blob {
		let array, binary, i , len;
		binary = atob(dataUrl.split(',')[1]);
		array = [];
		i = 0;
		len = binary.length;

		while(i<len) {
			array.push(binary.charCodeAt(i));
			i++;
		}

		return new Blob([new Uint8Array(array)], {
			type: 'image/jpg'
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
            duration: 4500
        });
    }

}