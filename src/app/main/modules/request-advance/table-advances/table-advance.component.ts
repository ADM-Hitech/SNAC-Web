import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import * as moment from "moment";

@Component({
    selector: 'app-table-advance',
    templateUrl: './table-advance.component.html',
    styleUrls: ['./table-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
        ])
    ]
})
export class TableAdvanceComponent implements OnInit {

    public expandedElement: any | null;
    public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    public columnsToDisplay: Array<string> = [
        'folio',
        'date',
        'amount',
        'date_payment',
        'commission',
        'interes',
        'vat',
        'total'
    ];

    @ViewChild('cFolio') cFolio: ElementRef;
    @ViewChild('cDate') cDate: ElementRef;
    @ViewChild('cAmount') cAmount: ElementRef;
    @ViewChild('cDatePayment') cDatePayment: ElementRef;
    @ViewChild('cCommission') cCommission: ElementRef;
    @ViewChild('cInteres') cInteres: ElementRef;
    @ViewChild('cVat') cVat: ElementRef;
    @ViewChild('total') cTotal: ElementRef;

    public cFolioWidth = 0;
    public cDateWidth = 0;
    public cAmountWidth = 0;
    public cDatePaymentWidth = 0;
    public cCommissionWidth = 0;
    public cInteresWidth = 0;
    public cVatWith = 0;
    public cTotalWith = 0;

    @Input() set data(data: Array<any>) {
        this.dataSource = new MatTableDataSource(data);
    }
    @Input() totalRow: number;

    @Output() changePage: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private readonly dialog: MatDialog,
        private readonly cdRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.updatedWidthColumns()
        }, 500);
    }

    public changeTable(event: any): void {
        this.changePage.emit(event);
    }

    public orderDetails(items: Array<any>):Array<any> {
        return items.sort((a, b) => a.detail.date_Payment > b.detail.date_Payment ? 1 : 0);
    }

    public updatedWidthColumns(): void {
        this.cFolioWidth = (this.cFolio.nativeElement as HTMLTableCellElement).clientWidth;
        this.cDateWidth = (this.cDate.nativeElement as HTMLTableCellElement).clientWidth;
        this.cAmountWidth = (this.cAmount.nativeElement as HTMLTableCellElement).clientWidth;
        this.cDatePaymentWidth = (this.cDatePayment.nativeElement as HTMLTableCellElement).clientWidth;
        this.cCommissionWidth = (this.cCommission.nativeElement as HTMLTableCellElement).clientWidth;
        this.cInteresWidth = (this.cInteres.nativeElement as HTMLTableCellElement).clientWidth;
        this.cVatWith = (this.cVat.nativeElement as HTMLTableCellElement).clientWidth;
        this.cTotalWith = (this.cTotal.nativeElement as HTMLTableCellElement).clientWidth;

        this.cdRef.detectChanges();
    }

    public payed(datep: any): boolean {
        let dayWeek: number = moment(datep).weekday();
        let date = moment(datep);

        if (dayWeek === 0) {
            dayWeek = 7;
        }

        if (dayWeek < 6) {
            date = date.add(5 - dayWeek, 'days');
        } else if (dayWeek === 6) {
            date = date.add(6, 'days');
        } else if (dayWeek === 7) {
            date = date.add(5, 'days');
        }

        return date < moment();
    }
}