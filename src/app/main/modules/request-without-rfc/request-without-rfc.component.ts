import { SelectionModel } from "@angular/cdk/collections";
import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatSnackBar, MatTableDataSource } from "@angular/material";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { RequestWithoutRfcService } from "./request-without-rfc.service";

@Component({
    selector: 'app-request-without-rfc',
    templateUrl: './request-without-rfc.component.html',
    styleUrls: ['./request-without-rfc.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RequestWithoutRfcComponent {

    public data: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    public selection = new SelectionModel<any>(true, []);
    public loading: boolean = false;
    public totalRow: number = 0;
    public columnsToDisplay: Array<string> = [
        'select',
        'name',
        'lastname',
        'mLastname',
        'employeeNumber',
        'curp',
        'company',
        'email',
        'phone',
        'date',
        'edit'
    ];
    public listProccess: Array<number> = [];

    constructor(
        private readonly service: RequestWithoutRfcService,
        private readonly snackBar: MatSnackBar
    ) {
        this.getRequest();
    }

    public getRequest(): void {
        this.loading = true;
        this.service.getRequests().subscribe((response) => {
            this.data = new MatTableDataSource<any>(response?.data);
            this.loading = false;
        }, err => {
            this.loading = false;
        });
    }

    public isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.data.data.length;
        return numSelected === numRows;
    }

    public masterToggle() {
        if (this.isAllSelected()) {
          this.selection.clear();
          return;
        }
    
        this.selection.select(...this.data.data);
    }

    public delete(id?: number): void {
        let ids = [];
        if (id) {
            ids.push(id);
        } else {
            ids = this.selection.selected.map((item) => item.id);
        }

        this.listProccess = ids;

        this.service.deleteRequest(ids).subscribe((response) => {
            if (response.success) {
                this.showAlert('SUCCESS', 'Elementos Eliminados', 'success');

                this.data.data = this.data.data.filter((item) => !ids.includes(item.id));
            } else {
                this.showAlert('ERROR', `${response.message}, intentelo mas tarde`, 'error');    
            }

            this.listProccess = [];
        }, err => {
            this.showAlert('ERROR', 'Ocurrio un error, intentelo mas tarde', 'error');
            this.listProccess = [];
        });
    }

    public sendNotification(id?: number): void {
        let ids = [];
        if (id) {
            ids.push(id);
        } else {
            ids = this.selection.selected.map((item) => item.id);
        }

        this.listProccess = ids;

        this.service.sendNotification(ids).subscribe((response) => {
            if (response.success) {
                this.showAlert('SUCCESS', 'Se a enviado la notificación', 'success');
            } else {
                this.showAlert('ERROR', `${response.message}, intentelo mas tarde`, 'error');
            }

            this.listProccess = [];
        }, err => {
            this.showAlert('ERROR', 'Ocurrio un error, intentelo mas tarde', 'error');
            this.listProccess = [];
        });
    }

    public getProcessing(id: number): boolean {
        return this.listProccess.filter((item) => item === id).length > 0;
    }

    private showAlert(message: string, subMessage: string, type: 'success' | 'error') {
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