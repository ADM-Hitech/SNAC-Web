import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { IFondeoControl } from '../../../../core/models/fondeo-control.interface';
import { trigger, state, transition, style, animate } from '@angular/animations';
import * as moment from 'moment';
import { MatDialog, MatPaginator, MatSnackBar } from '@angular/material';
import { DetailsInvesmentComponent } from '../../../../core/components/details-invesment/details-invesment.component';
import { FondeoControlService } from '../fondeo-control.service';
import { SnakBarAlertComponent } from '../../../../core/components/snak-bar-alert/snak-bar-alert.component';
import { DetailsPaymentComponent } from 'src/app/core/components/details-payment/details-payment.component';

@Component({
  selector: 'app-table-fondeo-control',
  templateUrl: './table-fondeo-control.component.html',
  styleUrls: ['./table-fondeo-control.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class TableFondeoControlComponent implements OnInit, AfterViewInit {

  dataSource: Array<any> = [];
  columnsToDisplay = [
    'id',
    'name',
    'investment',
    'startDate',
    'endDate',
    'interestRate',
    'interestRateMora',
    'payPeriodicity',
    'interestPayable',
    'defaultInterest',
    'setings',
    'totalInterestPay',
    'ivaInterest',
    'withholdingTaxes',
    'withholdingISR',
    'interestNetoPay',
    'daysMora',
    'nextInterestPaymentDate',
    'status',
    'principalPayment'
  ];
  expandedElement: IFondeoControl | null;
  totalPayment = 0;

  @ViewChild('cid') cid: ElementRef;
  @ViewChild('cname') cname: ElementRef;
  @ViewChild('cinsvestment') cinsvestment: ElementRef;
  @ViewChild('cstartdate') cstartdate: ElementRef;
  @ViewChild('cenddate') cenddate: ElementRef;
  @ViewChild('cinterestrate') cinterestrate: ElementRef;
  @ViewChild('cinterestpayable') cinterestpayable: ElementRef;
  @ViewChild('cdefaultinterest') cdefaultinterest: ElementRef;
  @ViewChild('cnextinterestpaymentdate') cnextinterestpaymentdate: ElementRef;
  @ViewChild('cstatus') cstatus: ElementRef;
  @ViewChild('cprincipalpayment') cprincipalpayment: ElementRef;

  @ViewChild('cinterestRateMora') cinterestRateMora: ElementRef;
  @ViewChild('cpayPeriodicity') cpayPeriodicity: ElementRef;
  @ViewChild('csetings') csetings: ElementRef;
  @ViewChild('ctotalInterestPay') ctotalInterestPay: ElementRef;
  @ViewChild('civaInterest') civaInterest: ElementRef;
  @ViewChild('cwithholdingTaxes') cwithholdingTaxes: ElementRef;
  @ViewChild('cwithholdingISR') cwithholdingISR: ElementRef;
  @ViewChild('cinterestNetoPay') cinterestNetoPay: ElementRef;
  @ViewChild('cdaysMora') cdaysMora: ElementRef;

  @Input() totalRow: number;
  @Output() changePage: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  public cidWidth = 0;
  public cnameWidth = 0;
  public cinsvestmentWidth = 0;
  public cstartdateWidth = 0;
  public cenddateiWidth = 0;
  public cinterestrateWidth = 0;
  public cinterestpayableWidth = 0;
  public cdefaultinterestWidth = 0;
  public cnextinterestpaymentdateWidth = 0;
  public cstatusWidth = 0;
  public cprincipalpaymentWidth = 0;

  public cinterestRateMoraWidth = 0;
  public cpayPeriodicityWidth = 0;
  public csetingsWidth = 0;
  public ctotalInterestPayWidth = 0;
  public civaInterestWidth = 0;
  public cwithholdingTaxesWidth = 0;
  public cwithholdingISRWidth = 0;
  public cinterestNetoPayWidth = 0;
  public cdaysMoraWidth = 0;

  @Input() detailsTotals: {
    subTotalPayNextDay: 0,
    iva: 0,
    retencionIva: 0,
    retencionISR: 0,
    interestNetoPerPay: 0,
    principalPay: 0,
    totalPayPeriodo: 0,
  };

  @Input() detailsTotalsAdeudo: {
    subTotalPayNextDay: 0,
    iva: 0,
    retencionIva: 0,
    retencionISR: 0,
    interestNetoPerPay: 0,
    total: 0,
  };

  @Input() set data(data: Array<any>) {
    this.parseData(data);
  }

  private dateNow = moment();

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private rest: FondeoControlService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const element = document.getElementById('contentTable');
    if (!!element) {
      element.addEventListener('scroll', (event) => {
        document.getElementById('cname').setAttribute('left', '114px');
      });
    }
  }

  ngAfterViewInit(): void {
    this.updatedSizedColumns();
  }

  updatedSizedColumns() {
    this.cidWidth = (this.cid.nativeElement as HTMLTableHeaderCellElement).clientWidth - 4;
    this.cnameWidth = (this.cname.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinsvestmentWidth = (this.cinsvestment.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cstartdateWidth = (this.cstartdate.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cenddateiWidth = (this.cenddate.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinterestrateWidth = (this.cinterestrate.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinterestpayableWidth = (this.cinterestpayable.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cdefaultinterestWidth = (this.cdefaultinterest.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cnextinterestpaymentdateWidth = (this.cnextinterestpaymentdate.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cstatusWidth = (this.cstatus.nativeElement as HTMLTableHeaderCellElement).clientWidth;

    this.cinterestRateMoraWidth = (this.cinterestRateMora.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cpayPeriodicityWidth = (this.cpayPeriodicity.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.csetingsWidth = (this.csetings.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.ctotalInterestPayWidth = (this.ctotalInterestPay.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.civaInterestWidth = (this.civaInterest.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cwithholdingTaxesWidth = (this.cwithholdingTaxes.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cwithholdingISRWidth = (this.cwithholdingISR.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cinterestNetoPayWidth = (this.cinterestNetoPay.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.cdaysMoraWidth = (this.cdaysMora.nativeElement as HTMLTableHeaderCellElement).clientWidth;

    this.cprincipalpaymentWidth = (this.cprincipalpayment.nativeElement as HTMLTableHeaderCellElement).clientWidth - 24;
    this.cdRef.detectChanges();
  }

  parseData(data: Array<any>): void {
    const tempData = [];
    data.forEach((element) => {
      const tempElement: any = {};
      tempElement.id = element.investor_Id;
      tempElement.name = element.name_Complete;

      const subElements = element.myInvestments;

      if (subElements.length > 0) {
        tempElement.investment = subElements[0].amount;
        tempElement.startDate = moment(subElements[0].start_Date).format('DD/MM/YY');
        tempElement.endDate = moment(subElements[0].end_Date).format('DD/MM/YY');
        tempElement.interestRate = subElements[0].interest_Rate;
        tempElement.interestPayable = subElements[0].interest_Payable;
        tempElement.defaultInterest = subElements[0].quantity_Interest_Arrears;
        tempElement.nextInterestPaymentDate = moment(subElements[0].pay_Day_Limit).format('DD/MM/YY');
        tempElement.status = subElements[0].enabled;
        tempElement.principalPayment = subElements[0].principal_Payment;
        tempElement.details = subElements[0].myInvestmentDetails;
        tempElement.statusLabel = subElements[0].capital_Status;
        tempElement.dayOverdue = subElements[0].day_Overdue;
        tempElement.periodName = subElements[0].period_Name;
        tempElement.totalInterest = subElements[0].total_Interest;
        tempElement.vat = subElements[0].vat;
        tempElement.vatRetention = subElements[0].vat_Retention;
        tempElement.isrRetention = subElements[0].isr_Retention;
        tempElement.netInterest = subElements[0].net_Interest;
        tempElement.infoPay = subElements[0];
        tempElement.promotionalSetting = subElements[0].promotional_Setting;

        tempElement.subElements = [];

        if (tempElement.status) {
          this.totalPayment += tempElement.interestPayable;
        }

        for (const row of subElements) {
          const elementActive = (row.myInvestmentDetails as Array<any>).find(ele => moment(ele.end_Date).month === this.dateNow.month);
          const daysDiff = moment(elementActive.end_Date).diff(this.dateNow, 'days');

          tempElement.subElements.push({
            investment: row.amount,
            startDate: moment(row.start_Date).format('DD/MM/YY'),
            endDate: moment(row.end_Date).format('DD/MM/YY'),
            interestRate: row.interest_Rate,
            interestMora: row.interest_Arrears,

            interestPayable: !!elementActive ? elementActive.interest_Payment : row.interest_Payable,
            defaultInterest: !!elementActive ? elementActive.default_Interest : row.quantity_Interest_Arrears,
            nextInterestPaymentDate: !!elementActive ? moment(elementActive.end_Date).format('DD/MM/YY') : moment(row.pay_Day_Limit).format('DD/MM/YY'),
            status: !!elementActive ? 'Activo' : row.enabled,
            principalPayment: !!elementActive ? elementActive.principal_Payment : row.principal_Payment,
            details: row.myInvestmentDetails,
            statusLabel: !!elementActive ? elementActive.principal_Payment > 0 ? 1 : 3 : row.capital_Status,
            infoPay: row,
            dayOverdue: row.day_Overdue,
            periodName: row.period_Name,

            totalInterest: !!elementActive ? elementActive.interest_Payment : row.total_Interest,
            vatRetention: !!elementActive ? elementActive.vat : row.vat_Retention,
            isrRetention: !!elementActive ? elementActive.isr_Retention : row.isr_Retention,
            netInterest: !!elementActive ? elementActive.payment : row.net_Interest,
            vat: !!elementActive ? elementActive.vat : row.vat,
            promotionalSetting: !!elementActive ? elementActive.promotional_Setting : row.promotional_Setting,
            color: !!elementActive ? daysDiff > 30 ?
              'blue' : (daysDiff <= 30 && daysDiff > 15) ?
              'yellow' : (daysDiff <= 15 && daysDiff > 5) ?
              'orange' : 'red' : 'blue'
          });

          if (tempElement.status) {
            this.totalPayment += row.interest_Payable;
          }
        }
      }

      tempData.push(tempElement);
    });

    this.dataSource = [...tempData];
    setTimeout(() => {
      this.updatedSizedColumns();
    }, 500);
  }

  details(childs: Array<any>, name: string, interestRate: number): void {
    this.dialog.open(DetailsInvesmentComponent, {
      data: {
        details: childs,
        name,
        interestRate
      }
    });
  }

  changeTable(event: any): void {
    this.changePage.emit(event);
  }

  pay(capital: any): void {
    this.rest.payCapital(capital).subscribe((response: any) => {
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

  getClassfirst(statusLabel: number): string {
    return statusLabel === 1 ? 'colorStatusDefault' : statusLabel === 2 ? 'colorStatusDisable' : 'colorStatusEnable';
  }

  getCurrentPeriodic(child: Array<any>): any {
    return !!child ? child.find((periodic) => periodic.isPeriodActual) : null;
  }

  detailsPaymen(): void {
    this.dialog.open(DetailsPaymentComponent, {
      data: {
        pay: this.detailsTotals,
        adeudo: this.detailsTotalsAdeudo
      }
    });
  }

}
