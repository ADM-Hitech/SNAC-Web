import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { IInvestor } from '../../../../core/models/investor.interface';
import { MatDialog, MatPaginator } from '@angular/material';
import { NewCallCapitalComponent } from '../../../../core/components/new-call-capital/new-call-capital.component';
import * as moment from 'moment';
import { EditInvestorComponent } from 'src/app/core/components/edit-investor/edit-investor.component';
import { FinalizeCallCapitalComponent } from 'src/app/core/components/finalize-call-capital/finalize-call-capital.component';

@Component({
  selector: 'app-table-investor',
  templateUrl: './table-investor.component.html',
  styleUrls: ['./table-investor.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class TableInvestorComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line:variable-name
  _data = null;

  @Input() set data(data: any) {
    this._data = data;
    if (!!this._data) {
      this.parseData(this._data);
    }
  }

  @Input() periodics;
  @Input() banks;

  @ViewChild('columnoptions') columnoptions: ElementRef;
  @ViewChild('columnid') columnid: ElementRef;
  @ViewChild('columnname') columnname: ElementRef;
  @ViewChild('columnflec') columnflec: ElementRef;
  @ViewChild('columnmc') columnmc: ElementRef;
  @ViewChild('columnme') columnme: ElementRef;
  @ViewChild('columnti') columnti: ElementRef;
  @ViewChild('columni') columni: ElementRef;
  @ViewChild('columnfi') columnfi: ElementRef;
  @ViewChild('columnft') columnft: ElementRef;
  @ViewChild('columnpp') columnpp: ElementRef;
  @ViewChild('columnlcs') columnlcs: ElementRef;
  @ViewChild('columnaa') columnaa: ElementRef;
  @ViewChild('columnsi') columnsi: ElementRef;
  @ViewChild('columndplc') columndplc: ElementRef;

  @Input() totalRow: number;
  @Output() changePage: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventDelete: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource = [];
  columnsToDisplay = [
    'options',
    'id',
    'name',
    'limitDateExecuteCapital',
    'amountCommitted',
    'amountExercised',
    'interestRate',
    'investments',
    'startDate',
    'endDate',
    'payPeriodicity',
    'capitalStatusCalls',
    'attachedFiles',
    'investmentStatus',
    'daysForCapitalCall'
  ];
  expandedElement: IInvestor | null;

  public columnoptionsWidth = 0;
  public columnidWidth = 0;
  public columnnameWidth = 0;
  public columnflecWidth = 0;
  public columnmcWidth = 0;
  public columnmeWidth = 0;
  public columntiWidth = 0;
  public columniWidth = 0;
  public columnfiWidth = 0;
  public columnftWidth = 0;
  public columnppWidth = 0;
  public columnlcsWidth = 0;
  public columnaaWidth = 0;
  public columnsiWidth = 0;
  public columndplcWidth = 0;

  constructor(private cdRef: ChangeDetectorRef, private dialog: MatDialog) { }

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

  updatedSizedColumns(): void {
    this.columnoptionsWidth = (this.columnoptions.nativeElement as HTMLTableHeaderCellElement).clientWidth - 4;
    this.columnidWidth = (this.columnid.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnnameWidth = (this.columnname.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnflecWidth = (this.columnflec.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnmcWidth = (this.columnmc.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnmeWidth = (this.columnme.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columntiWidth = (this.columnti.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columniWidth = (this.columni.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnfiWidth = (this.columnfi.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnftWidth = (this.columnft.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnppWidth = (this.columnpp.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnlcsWidth = (this.columnlcs.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnaaWidth = (this.columnaa.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columnsiWidth = (this.columnsi.nativeElement as HTMLTableHeaderCellElement).clientWidth;
    this.columndplcWidth = (this.columndplc.nativeElement as HTMLTableHeaderCellElement).clientWidth - 24;
    this.cdRef.detectChanges();
  }

  newCallCapital(user: any): void {

    this.dialog.open(NewCallCapitalComponent, {
      data: {
        user,
        periodics: this.periodics
      },
      panelClass: 'new-call-capital'
    });
  }

  parseData(data: Array<any>): void {
    const tempData = [];
    data.forEach((element) => {
      const tempElement: any = {};
      tempElement.id = element.id;
      tempElement.name = element.nameComplete;

      tempElement.first_Name = element.first_Name;
      tempElement.last_Name = element.last_Name;
      tempElement.mail = element.mail;
      tempElement.total_Amount_Agreed = element.total_Amount_Agreed;
      tempElement.start_Date_Prestaqi = element.start_Date_Prestaqi;
      tempElement.limit_Date = element.limit_Date;
      tempElement.rfc = element.rfc;
      tempElement.institution_Id = element.institution_Id;
      tempElement.clabe = element.clabe;
      tempElement.account_Number = element.account_Number;
      tempElement.is_Moral_Person	= element.is_Moral_Person;
      tempElement.enabled = element.enabled;
      tempElement.first_Login = element.first_Login;

      tempElement.limitDateExecuteCapital = moment(element.limit_Date).format('DD/MM/YY');
      tempElement.amountCommitted = element.total_Amount_Agreed;
      tempElement.amountExercised = element.amountExercised;
      tempElement.type = element.type;

      const subElements = element.capitalDatas;

      if (subElements.length > 0) {
        tempElement.capitalId = subElements[0].capital_Id;
        tempElement.interestRate =  subElements[0].interest_Rate;
        tempElement.investments = subElements[0].amount;
        tempElement.startDate = moment(subElements[0].start_Date).format('DD/MM/YY');
        tempElement.endDate = moment(subElements[0].end_Date).format('DD/MM/YY');
        tempElement.payPeriodicity = subElements[0].period;
        tempElement.capitalStatus = subElements[0].capital_Status;
        tempElement.attachedFiles = subElements[0].file;
        tempElement.investmentStatus = subElements[0].investment_Status,
        tempElement.daysForCapitalCall = '';
        tempElement.interestPaid = 0;
        tempElement.fileByte = subElements[0].file_Byte;
        tempElement.dayCapitalCall = subElements[0].day_Capital_Call;
        tempElement.subElements = [];

        for (let i = 1; i < subElements.length; i++) {
          tempElement.subElements.push({
            capitalId: subElements[i].capital_Id,
            interestRate: subElements[i].interest_Rate,
            amount: subElements[i].amount,
            startDate: moment(subElements[i].start_Date).format('DD/MM/YY'),
            endDate: moment(subElements[i].end_Date).format('DD/MM/YY'),
            period: subElements[i].period,
            capitalStatus: subElements[i].capital_Status,
            file: subElements[i].file,
            fileByte: subElements[i].file_Byte,
            investmentStatus: subElements[i].investment_Status,
            dayCapitalCall: subElements[i].day_Capital_Call,
            payPeriodicity: subElements[i].period
          });
        }
      }

      tempData.push(tempElement);
    });

    this.dataSource = [...tempData];
    setTimeout(() => {
      this.updatedSizedColumns();
    }, 500);
  }

  edit(element: any): void {
    const dialogRef = this.dialog.open(EditInvestorComponent, {
      data: {
        user: {
          id: element.id,
          first_Name: element.first_Name,
          last_Name: element.last_Name,
          mail: element.mail,
          total_Amount_Agreed: element.total_Amount_Agreed,
          start_Date_Prestaqi: element.start_Date_Prestaqi,
          limit_Date: element.limit_Date,
          rfc: element.rfc,
          institution_Id: element.institution_Id,
          clabe: element.clabe,
          account_Number: element.account_Number,
          is_Moral_Person: element.is_Moral_Person,
          enabled: element.enabled,
          first_Login: element.first_Login
        },
        banks: this.banks
      },
      panelClass: 'edit-investor-modal'
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.changePage.emit({
          pageIndex: 0,
          pageSize: 20
        });
      }
    });
  }

  changeTable(event: any): void {
    this.changePage.emit(event);
  }

  delete(id: number, type: number): void {
    this.eventDelete.emit({
      id,
      type
    });
  }

  finalizeCallCapital(item: any): void {

    if (item.capitalStatus === 'Enviado') {
      this.dialog.open(FinalizeCallCapitalComponent, {
        data: item
      }).afterClosed().subscribe(response => {
        if (response) {
          this.changePage.emit({
            pageIndex: 0,
            pageSize: 20
          });
        }
      });
    }
  }

}
