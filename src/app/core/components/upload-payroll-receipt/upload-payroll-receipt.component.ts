import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatIconRegistry, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { RequestAdvanceService } from "src/app/main/modules/request-advance/request-advance.service";
import { PaySheetModel } from "../../models/pay-sheet.model";
import { AuthService } from "../../services/auth/auth.service";
import { Utils } from "../../utils";
import { SnakBarAlertComponent } from "../snak-bar-alert/snak-bar-alert.component";

@Component({
    selector: 'app-upload-payroll-receipt',
    templateUrl: './upload-payroll-receipt.component.html',
    styleUrls: ['./upload-payroll-receipt.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UploadPayrollReceiptComponent implements AfterViewInit {

    @ViewChild('boxInput') boxInput: ElementRef;
    @ViewChild('inputFile') inputFile: ElementRef;
    public arrayBuffer: Array<any>;
    public totalFilesRequire = 1;
    public listFiles: Array<PaySheetModel> = [];
    public uploadingFile: boolean = false;
    
    constructor(
        private dialogRef: MatDialogRef<UploadPayrollReceiptComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            service: RequestAdvanceService,
            rfc: string | undefined,
            onlyOne: boolean
        },
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private auth: AuthService,
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

    public get closeModal(): boolean {
      return !this.data.onlyOne;
    }

    public get message(): string {
      return this.data.onlyOne ? 'Sube tu Último Recibo de Nómina' : 'Suba sus recibos de su ultimo mes de pago';
    }

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
            this.uploadingFile = true;

            this.data.service.uploadPaySheet(fileReader.result.toString()).subscribe((response) => {
              this.profilePaySheet(response, files[0]);
            }, err => {
              this.uploadingFile = false;

              this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'ERROR',
                  subMessage: 'Error al procesar el archivo, o su recibo de nomina es incorrecto',
                  type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
              });
            }, () => this.uploadingFile = false);
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
            this.uploadingFile = true;
            
            this.data.service.uploadPaySheet(fileReader.result.toString()).subscribe((response) => {
              this.profilePaySheet(response, files[0]);
            }, err => {
              this.uploadingFile = false;
              this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'ERROR',
                  subMessage: 'Error al procesar el archivo, o su recibo de nomina es incorrecto',
                  type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
              });
            }, () => this.uploadingFile = false);
          };
  
          fileReader.readAsDataURL(files[0]);
        }
      });
    }

    public get numberFilesRequire(): Array<number> {
      return Array.from({length: this.totalFilesRequire}, (_, i) => i + 1);
    }

    private deleteDefaultEvent(event: DragEvent | any): void {
        event.preventDefault();
        event.stopPropagation();
    }

    private profilePaySheet(response: any, file: File): void {
      const paysheet: PaySheetModel = PaySheetModel.fromJson(response);

      console.log(paysheet.dateFinish.toString() === 'Invalid Date');
      var invalidDateFinish = paysheet.dateFinish.toString() === 'Invalid Date';
      var invalidDateIntial = paysheet.dateInitial.toString() === 'Invalid Date';
      var invalidTotal = paysheet.total === null || paysheet.total === 0;
      var invalidNeto = paysheet.neto === null || paysheet.neto === 0;

      if (invalidDateFinish || invalidDateIntial) {
        this.showMessage('ERROR', 'El documento tiene una fecha no valida', 'error');
        
        return;
      }

      if (invalidTotal || invalidNeto) {
        this.showMessage('ERROR', 'El total no es valido', 'error');
        
        return;
      }

      const dateNow = moment();
      const dateInitial = moment(paysheet.dateInitial);
      const dateFin     = moment(paysheet.dateFinish);
      const limitDays   = dateNow.diff(dateInitial, 'days');
      const daysindates = dateFin.diff(dateInitial, 'days');
      const rfc         = response.rfc as string;
      const userRfc     = this.data.rfc || this.auth.rfc;
        
      this.countRequired(daysindates);

      if (limitDays > 38) {
        this.showMessage('ERROR', 'El documento no pertenece al ultimo periodo', 'error');
          
        return;
      }

      if (this.listFiles.some((element) => Utils.formatDate(element.dateInitial) === Utils.formatDate(response.fechainicio) && Utils.formatDate(element.dateFinish) === Utils.formatDate(response.fechafin) ) ) {
        this.showMessage('ERROR', 'El periodo ya fue agregado', 'error');

        return;
      }

      if (userRfc.substring(0, userRfc.length > 7 ? 8 : 0).toLowerCase() !== rfc.substring(0, rfc.length > 7 ? 8 : 0).toLowerCase()) {

        this.showMessage('ERROR', 'El documento tiene un rfc distinto al del usuario', 'error');

        return;
      }

      paysheet.uuid = Date.now().toString();
      paysheet.file = file;

      this.listFiles.push(paysheet);
      this.listFiles.sort((a, b) => a.dateInitial > b.dateInitial ? 1 : 0);

    }

    private countRequired(days: number) {
        if (days <= 6) {
            this.totalFilesRequire = 4;
        } else if (days > 6 && days <= 16) {
            this.totalFilesRequire = 2;
        }

        if (this.data.onlyOne) {
          this.totalFilesRequire = 1;
        }
    }

    public continue(): void {
      if (this.listFiles.length === this.totalFilesRequire) {
        this.dialogRef.close(this.listFiles);
      }
    }

    public showMessage(message: string, subMessage: string, type: 'error' | 'success'): void {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message,
          subMessage,
          type
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3500
      });
    }
    
}