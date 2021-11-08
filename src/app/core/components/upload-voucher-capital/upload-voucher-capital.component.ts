import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../services/constant';
import { appAnimations } from '../../animations';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-upload-voucher-capital',
  templateUrl: './upload-voucher-capital.component.html',
  styleUrls: ['./upload-voucher-capital.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class UploadVoucherCapitalComponent implements OnInit, AfterViewInit {

  @ViewChild('boxInput') boxInput: ElementRef;
  @ViewChild('inputFile') inputFile: ElementRef;
  public arrayBuffer: Array<any>;
  public loading = false;
  public errors = false;
  public fileName = '';
  public labelInput = 'Arrasta y suelta o haz click para buscar en tu equipo el archivo (.jpg o .png)<br>(OPCIONAL)';
  public token = '';
  public step = 1;
  public urlApi = '';
  public fileImage;


  constructor(
    public dialogRef: MatDialogRef<UploadVoucherCapitalComponent>,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private constant: Constant,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.matIconRegistry.addSvgIcon(
      'logoUpload',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-subir-archivo.svg')
    );

    this.token = localStorage.getItem('token');
    this.urlApi = `${this.constant.api}Users/GetContract?token=${this.token}&capitalId=${this.data.capitaId}`;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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

  processFile(files: FileList) {
    this.loading = true;
    this.fileImage = '';

    if (files.length > 0) {
      this.fileName = this.labelInput = files[0].name;

      if (!(files[0].type.includes('png') || files[0].type.includes('jpg') || files[0].type.includes('jpeg'))) {
        this.errors = true;
        this.loading = false;
        this.labelInput = 'Formato no valido, formatos aceptados .jpg o .png. Puede tomar una captura de pantalla de su recibo y agregarla';
        return;
      }

      this.errors = false;

      this.labelInput = files[0].name;

      const formatImage = new File([files[0]], `vaucher_${this.data.capitaId}.jpg`, { type: 'application/octet-stream' });
      this.fileName = `vaucher_${this.data.capitaId}.jpg`;
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const arrayBuffer = fileReader.result;
        const bytes = new Uint8Array(arrayBuffer as any);
        this.arrayBuffer = [...bytes];

        const blobImage = new Blob([bytes], { type: 'image/*'});
        const urlCreator = window.URL || window.webkitURL;
        const imgUrl = urlCreator.createObjectURL(blobImage);

        this.fileImage = this.domSanitizer.bypassSecurityTrustResourceUrl(imgUrl);

        this.loading = false;
      };

      fileReader.readAsArrayBuffer(formatImage);
    }
  }

  deleteDefaultEvent(event: DragEvent | any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  submit(): void {
    this.errors = false;

    this.loading = true;

    this.http.post(`${this.constant.api}Capitals/ChangeStatus`, {
      file_name: this.fileName,
      file_byte: this.arrayBuffer,
      capital_id: this.data.capitaId,
      status: 2
    }).subscribe((response: any) => {
      if (response.success) {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
          data: {
            message: 'EXITOSO',
            subMessage: response.message,
            type: 'success'
          },
          panelClass: 'snack-message',
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2500
        });

        this.http.put(`${this.constant.api}Notifications/DisableNotification`, {
          NotificationIds: [this.data.alertId]
        }).subscribe(() => {}, error => {});

        this.dialogRef.close(true);
      } else {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
          data: {
            message: 'ERROR',
            subMessage: response.message,
            type: 'error'
          },
          panelClass: 'snack-message',
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2500
        });
        this.dialogRef.close(false);
      }

      this.loading = false;
    }, error => {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR',
          subMessage: 'Error Server',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2500
      });
      this.loading = false;
    });
  }

  secondButton(): void {
    if (this.step === 1) {
      this.dialogRef.close(false);
    } else {
      this.step = 1;
    }
  }

  nextStep(): void {
    if (this.step === 2) {
      this.submit();
    }
    this.step = 2;
  }


}
