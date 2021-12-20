import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatIconRegistry, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { appAnimations } from 'src/app/core/animations';
import { EditLicenseComponent } from 'src/app/core/components/edit-license/edit-license.component';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LicenseService } from '../license.service';

@Component({
    selector: 'app-table-license',
    templateUrl: './table-license.component.html',
    styleUrls: ['./table-license.component.scss'],
    animations: appAnimations,
    encapsulation: ViewEncapsulation.None
})
export class TableLicenseComponent {

    @Input() totalRow: number;
    @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
    public columnsToDisplay = [
        'action',
        'name',
        'namePersonCharge',
        'contractNumber',
        'licenseNumber',
        'datePayment',
        'costCenter',
        'created',
        'updated'
    ];

    @Output() changePage: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
        private dialog: MatDialog,
        private auth: AuthService)
    {
        this.matIconRegistry.addSvgIcon(
            'iconEdit',
            this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-editar.svg')
          );
    }

    changeTable(event: any): void {
        this.changePage.emit(event);
    }

    public edit(element: any): void {
        const dialogRef = this.dialog.open(EditLicenseComponent, {
            data: {
                id: element.id,
                CostCenter: element.costCenter,
                Name: element.name,
                NamePersonCharge: element.namePersonCharge,
                ContractNumber: element.contractNumber,
                LicenseNumber: element.licenseNumber,
                DatePayment: element.datePayment,
                Prices: element.prices,
                ModelPrestaqi: element.modelPrestaqi,
                OriginatorAccount: element.originatorAccount
            },
            panelClass: 'edit-license-modal'
        });

        dialogRef.afterClosed().subscribe((response) => {
            if (!!response && response) {
                this.changePage.emit({
                    pageIndex: 0,
                    pageSize: 50
                });
            }
        });
    }

    public get isLicense(): boolean {
        return this.auth.getRol() === 'License';
    }
}
