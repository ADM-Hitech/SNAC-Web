import { Component, OnInit, Injectable, Inject, ViewEncapsulation, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { appAnimations } from '../../animations';
import { AddSettingsAdvancesComponent } from '../add-settings-advances/add-settings-advances.component';

@Component({
  selector: 'app-details-advances-acredited',
  templateUrl: './details-advances-acredited.component.html',
  styleUrls: ['./details-advances-acredited.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class DetailsAdvancesAcreditedComponent implements OnInit {

  dataSource: Array<any> = [];
  user: any;

  columnsToDisplay = [
    'advance',
    'date',
    'day',
    'rate',
    'comition',
    'settings',
    'totalForPayed',
    'state',
    'addSettings'
  ];

  @ViewChild('cadvance') cadvance: ElementRef;
  @ViewChild('cdate') cdate: ElementRef;
  @ViewChild('cdays') cdays: ElementRef;
  @ViewChild('cinterestRate') cinterestRate: ElementRef;
  @ViewChild('ccommission') ccommission: ElementRef;
  @ViewChild('csettings') csettings: ElementRef;
  @ViewChild('csettingsForPay') csettingsForPay: ElementRef;
  @ViewChild('cstate') cstate: ElementRef;
  @ViewChild('caddSettings') caddSettings: ElementRef;

  public cadvanceWidth = 0;
  public cdateWidth = 0;
  public cdaysWidth = 0;
  public cinterestRateWidth = 0;
  public ccommissionWidth = 0;
  public csettingsWidth = 0;
  public csettingsForPayWidth = 0;
  public cstateWidth = 0;
  public caddSettingsWidth = 0;

  constructor(
    public dialogRef: MatDialogRef<DetailsAdvancesAcreditedComponent>,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (!!data.advances) {
      this.dataSource = [...data.advances];

      setTimeout(() => {
        this.updatedWidthColumn();
      }, 500);
    }

    if (!!data.user) {
      this.user = data.user;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.updatedWidthColumn();
    }, 500);
  }

  addSettings(advance: any, isDetails: boolean = false): void {

    const dialogResult = this.dialog.open(AddSettingsAdvancesComponent, {
      data: {
        advance: isDetails ? advance.detail : advance,
        isDetails,
        AccreditedId: isDetails ? advance.detail.accredited_Id : advance.accredited_Id
      },
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

  updatedWidthColumn(): void {
    this.cadvanceWidth = (this.cadvance.nativeElement as HTMLTableCellElement).clientWidth - 24;
    this.cdateWidth = (this.cdate.nativeElement as HTMLTableCellElement).clientWidth;
    this.cdaysWidth = (this.cdays.nativeElement as HTMLTableCellElement).clientWidth;
    this.cinterestRateWidth = (this.cinterestRate.nativeElement as HTMLTableCellElement).clientWidth;
    this.ccommissionWidth = (this.ccommission.nativeElement as HTMLTableCellElement).clientWidth;
    this.csettingsWidth = (this.csettings.nativeElement as HTMLTableCellElement).clientWidth;
    this.csettingsForPayWidth = (this.csettingsForPay.nativeElement as HTMLTableCellElement).clientWidth;
    this.cstateWidth = (this.cstate.nativeElement as HTMLTableCellElement).clientWidth;
    this.caddSettingsWidth = (this.caddSettings.nativeElement as HTMLTableCellElement).clientWidth - 24;

    this.cdRef.detectChanges();
  }

  contentDetails(row: any): boolean {
    return row.details != null && row.details.length > 0;
  }

  totalWithOld(row: any): number {
    if (this.contentDetails(row)) {
      return row.details.reduce((b, c) => b + parseFloat(c.detail.total_Payment), 0);
    }

    return row.total_Withhold;
  }

}
