import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { LoginService } from "src/app/main/modules/login/login.service";
import { IneFrontModel } from "../../models/ine-front-model";
import { IneModel } from "../../models/ine-model";
import { Utils } from "../../utils";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-very-ine',
    templateUrl: './verify-ine.component.html',
    styleUrls: ['./verify-ine.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerifyIneComponent implements AfterViewInit, OnDestroy {

    @ViewChild('boxInput') boxInput: ElementRef;
	@ViewChild('inputFile') inputFile: ElementRef;
    public type: 'front' | 'back' = 'front';
	public uploadingINE: boolean = false;
    public completeINE: Array<IneModel> = [];
	public takePicker: boolean = false;
	private canvas: HTMLCanvasElement;
	private video: HTMLVideoElement;

    constructor(
        private dialogRef: MatDialogRef<VerifyIneComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: LoginService,
			curp: string | null
        },
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private snackBar: MatSnackBar,
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

		this.checkHaveCameraBack();
    }

	private async checkHaveCameraBack(): Promise<void> {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const supports = await navigator.mediaDevices.getSupportedConstraints();
		const back = devices.filter(item => item.kind == 'videoinput' && (item.label.includes('back') || item.label.includes('trasera')));

		this.takePicker = back.length > 0 && supports['facingMode'];
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

		navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: { exact: 'environment', ideal:  'environment' }
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

		this.video.addEventListener('canplay', function(_) {
			if (!streaming) {
				height = this.videoHeight / (this.videoWidth / width);
				this.setAttribute('width', widthBody > 500 ? width.toString() : '100%');
				this.setAttribute('height', height.toString());
				streaming = true;
			}
		}, false);
	}

	public takePicture(): void {
		try {
			this.uploadingINE = true;
			this.canvas.width = 342 * 3;
			this.canvas.height = 262 * 3;
			this.canvas.getContext('2d').drawImage(this.video, 0, 0, 342 * 3, 262 * 3);

			const blobcustom = Utils.dataURLtoBlob(this.canvas.toDataURL());
			
			this.uploadIne({}, new File([blobcustom], this.type == 'front' ? "ine_front.jpg" : "ine_back.jpg", {
				lastModified: Date.now(),
				type: 'image/jpg'
			}));
		} catch (e) {
			console.log(e);
		}
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
				this.uploadingINE = true;

				this.uploadIne({}, files[0]);
			};

			fileReader.readAsDataURL(files[0]);
		}
	}

    private deleteDefaultEvent(event: DragEvent | any): void {
		event.preventDefault();
		event.stopPropagation();
	}

    private async uploadIne(response: any, file: File): Promise<void> {
        let ine: IneModel;

        if (this.type === 'front') {
            ine = IneFrontModel.fromJson(response);

            this.type = 'back';
        } else {
            ine = IneModel.fromJson(response);
        }

		ine.file = file;

        this.completeINE.push(ine);

        if (this.completeINE.length === 2) {
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
				this.uploadingINE = false;
				this.dialogRef.close(this.completeINE);
			}, 1500);
        } else {
			setTimeout(() => {
				this.uploadingINE = false;
			}, 1000);
		}
    }
}