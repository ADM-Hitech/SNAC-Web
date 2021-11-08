import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { IAdvanceReceivable } from '../../../../core/models/advance-receivable.interface';
import { trigger, state, animate, style, transition } from '@angular/animations';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DetailsAdvancesAcreditedComponent } from '../../../../core/components/details-advances-acredited/details-advances-acredited.component';
import { PayCompanyComponent } from '../../../../core/components/pay-company/pay-company.component';
import { AdvancesReceivableService } from '../advances-receivable.service';
import { SnakBarAlertComponent } from '../../../../core/components/snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-table-advances-receivable',
  templateUrl: './table-advances-receivable.component.html',
  styleUrls: ['./table-advances-receivable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class TableAdvancesReceivableComponent implements OnInit {

  dataSource: Array<any> = [];
  columnsToDisplay = [
    'options',
    'company',
    'numberContrato',
    'id',
    'name',
    'advance',
    'date',
    'day',
    'interestRate',
    'interestRateMora',
    'interest',
    'interestMora',
    'commitions',
    'settings',
    'subtotalReceivable',
    'iva',
    'daysMoraPayInteres',
    'totalPayment'
  ];
  expandedElement: IAdvanceReceivable | null;
  subExpandedElement: any | null;
  subExpandedElementDetail: any | null;

  @Input() set data(data: Array<any>) {
    this.dataSource = [...data];

    setTimeout(() => {
      this.updatedWidthColumn();
    }, 500);
  }

  @Output() changeTable = new EventEmitter();

  @ViewChild('coptions') coptions: ElementRef;
  @ViewChild('ccompany') ccompany: ElementRef;
  @ViewChild('cnumberContrato') cnumberContrato: ElementRef;
  @ViewChild('cid') cid: ElementRef;
  @ViewChild('cname') cname: ElementRef;
  @ViewChild('cadvance') cadvance: ElementRef;
  @ViewChild('cdate') cdate: ElementRef;
  @ViewChild('cday') cday: ElementRef;
  @ViewChild('cinterestRate') cinterestRate: ElementRef;
  @ViewChild('ccommitions') ccommitions: ElementRef;
  @ViewChild('ctotalPayment') ctotalPayment: ElementRef;

  @ViewChild('cinterestRateMora') cinterestRateMora: ElementRef;
  @ViewChild('cinterest') cinterest: ElementRef;
  @ViewChild('cinterestMora') cinterestMora: ElementRef;
  @ViewChild('csettings') csettings: ElementRef;
  @ViewChild('csubtotalReceivable') csubtotalReceivable: ElementRef;
  @ViewChild('civa') civa: ElementRef;
  @ViewChild('cdaysMoraPayInteres') cdaysMoraPayInteres: ElementRef;

  public coptionssWidth = 0;
  public ccompanyWidth = 0;
  public cnumberContratoWidth = 0;
  public cidWidth = 0;
  public cnameWidth = 0;
  public cadvanceWidth = 0;
  public cdateWidth = 0;
  public cdayWidth = 0;
  public cinterestRateWidth = 0;
  public ccommitionsWidth = 0;
  public ctotalPaymentWidth = 0;

  public cinterestRateMoraWidth = 0;
  public cinterestWidth = 0;
  public cinterestMoraWidth = 0;
  public csettingsWidth = 0;
  public csubtotalReceivableWidth = 0;
  public civaWidth = 0;
  public cdaysMoraPayInteresWidth = 0;
  public savingStatus = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private rest: AdvancesReceivableService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  updatedWidthColumn(): void {
    this.coptionssWidth = (this.coptions.nativeElement as HTMLTableHeaderCellElement).clientWidth - 24;
    this.ccompanyWidth = (this.ccompany.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cnumberContratoWidth = (this.cnumberContrato.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cidWidth = (this.cid.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cnameWidth = (this.cname.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cadvanceWidth = (this.cadvance.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cdateWidth = (this.cdate.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cdayWidth = (this.cday.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinterestRateWidth = (this.cinterestRate.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.ccommitionsWidth = (this.ccommitions.nativeElement as HTMLTableHeaderCellElement).clientWidth;

    this.cinterestRateMoraWidth = (this.cinterestRateMora.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinterestWidth = (this.cinterest.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinterestMoraWidth = (this.cinterestMora.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.csettingsWidth = (this.csettings.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.csubtotalReceivableWidth = (this.csubtotalReceivable.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.civaWidth = (this.civa.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cdaysMoraPayInteresWidth = (this.cdaysMoraPayInteres.nativeElement as HTMLTableHeaderCellElement).clientWidth;

    this.ctotalPaymentWidth = (this.ctotalPayment.nativeElement as HTMLTableHeaderCellElement).clientWidth - 24;
    this.cdRef.detectChanges();
  }

  showDetailsAcredited(user: any, companyName: string): void {
    this.dialog.open(DetailsAdvancesAcreditedComponent, {
      data: {
        user: {
          name: user.nameComplete,
          interestRate: user.interest_Rate,
          companyName,
          id: user.accredited_Id
        },
        advances: user.advances
      }
    });
  }

  getTotalPay(user): number {
    return user.advances.reduce((a, b) => a + b.total_Withhold, 0);
  }

  getTotal(item: any): number {
    return item.accrediteds.reduce((a, b) => a + (b.advances.reduce((x, y) => x + y.total_Withhold, 0)), 0);
  }

  payCompany(companyId: number, advances: Array<any>, totalAmount: number): void {
    const paidAdvance = [];

    advances.forEach((accredited) => {
      accredited.advances.forEach(advanc => {
        paidAdvance.push({
          Advance_Id: advanc.id,
          Accredited_Id: accredited.accredited_Id,
          Contract_Type_Id: accredited.typeContractId
        });
      });
    });

    const dialogRef = this.dialog.open(PayCompanyComponent, {
      data: {
        company_id: companyId,
        advanceIds: paidAdvance ?? [],
        totalAmount
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.changeTable.emit();
      }
    });
  }

  isCompanySaving(companyId): boolean {
    return this.savingStatus.some(e => e === companyId);
  }

  activeOrCancelService(companyId: number, status: boolean): void {
    this.savingStatus.push(companyId);

    this.rest.activeOrCancelService(companyId, status).subscribe((response) => {
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

        this.changeTable.emit();
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

      this.savingStatus = [...this.savingStatus.filter(e => e !== companyId)];
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

      this.savingStatus = [...this.savingStatus.filter(e => e !== companyId)];
    });
  }

  isCanceled(acredited: Array<any>): boolean {
    return acredited.some(a => a.is_Blocked);
  }
}
