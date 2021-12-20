import { Component, Input, Output, ViewEncapsulation, EventEmitter, ErrorHandler } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { PreviewDocumentComponent } from 'src/app/core/components/preview_document/preview_document.component';
import { SnakBarAlertComponent } from 'src/app/core/components/snak-bar-alert/snak-bar-alert.component';
import { PendingRecordService } from '../pending-records.service';

@Component({
    selector: 'app-table-pending-records',
    templateUrl: './table-pending-records.component.html',
    styleUrls: ['./table-pending-records.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TablePendingRecordsComponent {

    public columnToDisplay = [
        'fullname',
        'employee_number',
        'curp',
        'account_number',
        'clabe',
        'date',
        'status',
        'actions'
    ];

    @Input() totalRow: number;
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @Output() changePage: EventEmitter<any> = new EventEmitter<any>();
    public proccessIds: Array<number> = [];

    constructor(
        private dialog: MatDialog,
        private service: PendingRecordService,
        private snackBar: MatSnackBar
    ) {}

    public changeTable(event: any): void {
        this.changePage.emit(event);
    }

    public viewDocument(document: string, item: any): void {
        let path: string | Array<string> = '';

        try {
            path = this.processPath(document, item);
        } catch (err) {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                    message: 'ERROR',
                    subMessage: err.toString(),
                    type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });

            return;
        }

        const type = this.typeFile(path);
        const id = this.getIdDocument(document, item);

        const dialogResult = this.dialog.open(PreviewDocumentComponent, {
            data: {
                title: document,
                path,
                type
            }
        });

        dialogResult.afterClosed().subscribe((response) => {
            if (!response) {
                return;
            }

            this.service.actionDocument({
                Type: document,
                Approve: response.approve,
                Message: response.message,
                IdDocument: id,
                AccreditedId: item.id
            }).subscribe((data) => {
                this.snackBar.openFromComponent(SnakBarAlertComponent, {
                    data: {
                      message: 'EXITOSO',
                      subMessage: 'Mensaje enviado',
                      type: 'success'
                    },
                    panelClass: 'snack-message',
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2500
                });
            }, err => {
                this.snackBar.openFromComponent(SnakBarAlertComponent, {
                    data: {
                      message: 'ERROR',
                      subMessage: 'Error al enviar el mensaje',
                      type: 'error'
                    },
                    panelClass: 'snack-message',
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    duration: 2500
                });
            });
        });
    }

    public processPath(type: string, item: any): string | Array<string> {
        let path: string | Array<string> = '';

        switch (type) {
            case 'INE':
                if (item.ineAccount == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                path = [item.ineAccount.pathFileBack, item.ineAccount.pathFileFront];
                break;
            case 'SELFIE':
                if (item.selfie == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                path = item.selfie.pathFile;
                break;
            case 'ESTADO DE CUENTA':
                if (item.statusAccount == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                path = item.statusAccount.pathFile;
                break;
            case 'RECIBO DE NOMINA':
                if (item.paySheet == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                path = item.paySheetInitial.map((item) => item.pathFile);
                break;
        }

        return path;
    }

    public getIdDocument(type: string, item: any): number {
        let id = 0;

        switch (type) {
            case 'INE':
                if (item.ineAccount == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                id = item.ineAccount.id;
                break;
            case 'SELFIE':
                if (item.selfie == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                id = item.selfie.id;
                break;
            case 'ESTADO DE CUENTA':
                if (item.statusAccount == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                id = item.statusAccount.id;
                break;
            case 'RECIBO DE NOMINA':
                if (item.paySheet == null) {
                    throw new Error('El Archivo no a sido cargado');
                }
                id = item.paySheet.id;
                break;
        }

        return id;
    }

    public typeFile(path: string | Array<string>): string | Array<string> {
        let result: string | Array<string> = 'image';

        if (Array.isArray(path)) {
            result = [];
            path.forEach((item) => {
                const split = item.split('.');

                switch (split[split.length - 1]) {
                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                        (result as Array<string>).push('image');
                        break;
                    case 'pdf':
                        (result as Array<string>).push('pdf');
                        break;
                }
            });
        } else {
            const split = path.split('.');
            switch (split[split.length - 1]) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                    result = 'image';
                    break;
                case 'pdf':
                    result = 'pdf';
                    break;
            }
        }

        return result;
    }

    public approveDocuments(id: number): void {
        this.proccessIds.push(id);

        this.service.approveDocuments(id).subscribe((data) => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'EXITOSO',
                  subMessage: 'Los documentos fueron aprovados',
                  type: 'success'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });

            this.proccessIds = this.proccessIds.filter(item => item !== id);

            this.changePage.emit({ pageIndex: 0, pageSize: 50 });
        }, err => {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
                data: {
                  message: 'ERROR',
                  subMessage: 'Intentelo mas tarde',
                  type: 'error'
                },
                panelClass: 'snack-message',
                horizontalPosition: 'right',
                verticalPosition: 'top',
                duration: 2500
            });

            this.proccessIds = this.proccessIds.filter(item => item !== id);
        });
    }

    public loadingProccess(id: number): boolean {
        return this.proccessIds.filter(item => item === id).length > 0;
    }
}
