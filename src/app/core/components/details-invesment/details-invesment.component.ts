import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { FondeoControlService } from '../../../main/modules/fondeo-control/fondeo-control.service';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';
import { AddSettingsComponent } from '../add-settings/add-settings.component';

@Component({
  selector: 'app-details-invesment',
  templateUrl: './details-invesment.component.html',
  styleUrls: ['./details-invesment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsInvesmentComponent implements OnInit {

  dataSource: Array<any> = [];
  columnsToDisplay = [
    'period',
    'initialDate',
    'endDate',
    'outstandingBalance',
    'principalPayment',
    'interestPayment',
    'interesMoratorio',
    'settings',
    'vat',
    'vatRetention',
    'isrRetention',
    'payment',
    'pay',
    'addSettings'
  ];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DetailsInvesmentComponent>,
    private rest: FondeoControlService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (!!data.details) {
      this.dataSource = [...data.details];
    }
  }

  ngOnInit() {
  }

  getPrincipalPayment(): number {
    return this.data.details.reduce((a, b) => a + b.principal_Payment, 0);
  }

  getInterestPayment(): number {
    return this.data.details.reduce((a, b) => a + b.interest_Payment, 0);
  }

  getVat(): number {
    return this.data.details.reduce((a, b) => a + b.vat, 0);
  }

  getVatRetention(): number {
    return this.data.details.reduce((a, b) => a + b.vat_Retention, 0);
  }

  getIsrRetention(): number {
    return this.data.details.reduce((a, b) => a + b.isr_Retention, 0);
  }

  getPayment(): number {
    return this.data.details.reduce((a, b) => a + b.payment, 0);
  }

  getInteresMoratorio(): number {
    return this.data.details.reduce((a, b) => a + b.default_Interest, 0);
  }

  getSettings(): number {
    return this.data.details.reduce((a, b) => a + b.promotional_Setting, 0);
  }

  pay(periodic: any): void {
    this.rest.payCapital(periodic).subscribe((response: any) => {
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

        periodic.isPayment = true;

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
      }
    }, error => {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR',
          subMessage: 'Error del server',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2500
      });
    });
  }

  addSettings(periodic: any): void {
    const dialogResult = this.dialog.open(AddSettingsComponent, {
      data: periodic
    });

    dialogResult.afterClosed().subscribe((response) => {
      if (!!response) {
        const newData = this.dataSource.map((element) => {
          if (element.id === response.id) {
            element = response;
          }

          return element;
        });

        this.dataSource = [...newData];
      }
    });
  }

  exportFile(type): void {
    this.loading = true;
    this.rest.detailsFechFile({
      Type: type,
      Name: this.data.name,
      Interest_Rate: this.data.interestRate,
      CapitalDetails: this.dataSource
    }).subscribe(result => {
      this.loading = false;
      const url = window.URL.createObjectURL(result.data);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = result.filename;
      a.click();
    });
  }

}
