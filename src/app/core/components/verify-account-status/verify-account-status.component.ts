import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
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
export class VerifyAccountStatusComponent implements AfterViewInit, OnDestroy {

    @ViewChild('boxInput') boxInput: ElementRef;
	@ViewChild('inputFile') inputFile: ElementRef;
	public institutions: Array<any> = [];
    public uploadingStatusAccount: boolean = false;
	public institutionId: number;
	public loading = true;
	public takePicker: boolean = false;
	private canvas: HTMLCanvasElement;
	private video: HTMLVideoElement;
    
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
		this.checkHaveCameraBack();
    }

	private async checkHaveCameraBack(): Promise<void> {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const supports = await navigator.mediaDevices.getSupportedConstraints();
		const back = devices.filter(item => item.kind == 'videoinput' && (item.label.includes('back') || item.label.includes('trasera'))).length;

		this.takePicker = back > 0 && supports['facingMode'];
	}

	private getInstitutions(): void {
		this.data.service.getInstitutions().subscribe((response) => {
			this.institutions = response.data;

			this.loading = false;
		});
	}

    ngAfterViewInit(): void {
        this.observerBoxInput();
		this.onloadCapture();
    }

	ngOnDestroy(): void {
		if (this.video) {
			this.video.pause();
			this.video.src = "";
			this.video.srcObject = null;
		}
	}

	private observerBoxInput(): void {
		if (!!!this.boxInput) {
			return;
		}

		(this.boxInput.nativeElement as HTMLDivElement).addEventListener('click', (event) => {
			(this.inputFile.nativeElement as HTMLInputElement).click();
		});

		(this.inputFile.nativeElement as HTMLInputElement).addEventListener('change', (event) => {
			this.deleteDefaultEvent(event);
			const files = (event.target as HTMLInputElement).files;
			this.processFile(files);
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
			this.processFile(files);
		});
	}

	private onloadCapture(): void {
		let streaming = false;
		this.canvas = document.getElementById('camera') as HTMLCanvasElement;
		this.video = document.getElementById('video') as HTMLVideoElement;

		const widthBody = document.body.clientWidth;
		let width = 350;
		let height = 0;

		this.video.addEventListener('canplay', function(_) {
			if (!streaming) {
				height = this.videoHeight / (this.videoWidth / width);
				this.setAttribute('width', widthBody > 500 ? width.toString() : '100%');
				this.setAttribute('height', height.toString());
				streaming = true;
			}
		}, false);

		navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: { exact: 'environment' }
			},
			audio: false
		}).then(stream => {
			this.video.srcObject = stream;
			this.video.play();
			(window as any).stream = stream;
		}, err => {
			this.takePicker = false;
			console.log('new forma', err);
		});
	}

	public takePicture(): void {
		this.uploadingStatusAccount = true;
		this.canvas.width = 342 * 3;
		this.canvas.height = 262 * 3;
		this.canvas.getContext('2d').drawImage(this.video, 0, 0, 342 * 3, 262 * 3);
		
		const blobcustom = Utils.dataURLtoBlob(this.canvas.toDataURL());

		const fileReader = new FileReader();
		this.sendBinaria(fileReader, new File([blobcustom], "cap_account_status.jpg", {
			lastModified: Date.now(),
			type: 'image/jpg'
		}));
	}

	private processFile(files: FileList): void {
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

		this.uploadAccountStatus({}, file);
	}

    private uploadAccountStatus(response: any, file: File): void {
        const accountStatus: AccountStatusModel = AccountStatusModel.fromJson(response);
		accountStatus.institutionId = this.institutionId;
		accountStatus.file = file;

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
			this.uploadingStatusAccount = false;
			this.dialogRef.close(accountStatus);
		}, 1500);
    }
}