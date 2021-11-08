import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatIconRegistry, MatSnackBar, MatInput } from '@angular/material';
import { EditInvestorComponent } from '../../../core/components/edit-investor/edit-investor.component';
import { InvestorService } from './investor.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalConfirmComponent } from '../../../core/components/modal-confirm/modal-confirm.component';
import { SnakBarAlertComponent } from '../../../core/components/snak-bar-alert/snak-bar-alert.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestorComponent implements OnInit {

  data: Array<any> = [];
  periodics: Array<any> = [];
  banks: Array<any> = [];
  loading = false;
  public totalRow = 0;
  @ViewChild('Filter') filter: MatInput;
  public filterControl = new FormControl();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private rest: InvestorService,
    private snackBar: MatSnackBar
  ) {
    this.matIconRegistry.addSvgIcon(
      'iconEdit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-editar.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconDelete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-borrar.svg')
    );
  }

  ngOnInit(): void {
    this.fetchData();
    this.fetchBanks();
    this.filterControl.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.onSearchChange(value);
      });
  }

  edit(): void {
    this.dialog.open(EditInvestorComponent, {
      panelClass: 'edit-investor-modal'
    });
  }

  fetchData(page: number = 1, numRecord: number = 20, filter: string = ''): void {
    this.loading = true;

    forkJoin([
      this.rest.fetchTableInvestors(page, numRecord, filter),
      this.rest.fetchPeriodic()
    ]).subscribe((response) => {
      if (response[0].success) {
        this.data = response[0].data.investorDatas;
        this.totalRow = response[0].data.totalRecord;
      }

      if (response[1].success) {
        this.periodics = response[1].data;
      }

      this.loading = false;
    }, (err) => {
      this.loading = false;
    });
  }

  onSearchChange(data: string) {
    this.fetchData(1, 20, data);
  }

  changePage(event): void {
    this.loading = true;

    this.rest.fetchTableInvestors(event.pageIndex + 1, event.pageSize, this.filter.value).subscribe((response) => {
      if (response.success) {
        this.data = response.data.investorDatas;
        this.totalRow = response.data.totalRecord;
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  exportFile(type): void {
    this.loading = true;
    this.rest.fetchFile(type).subscribe(result => {
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

  delete(event): void {
    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        head: 'Eliminar Inversionistas',
        title: '¿Estás seguro?',
        subTitle: '¡Los registros seran eliminados!'
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.rest.delete(event.id, event.type).subscribe(res => {
          if (res.success) {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
              data: {
                message: 'EXITOSO',
                subMessage: res.message,
                type: 'success'
              },
              panelClass: 'snack-message',
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 2500
            });
            this.fetchData();
          } else {
            this.snackBar.openFromComponent(SnakBarAlertComponent, {
              data: {
                message: 'ERROR',
                subMessage: res.message,
                type: 'error'
              },
              panelClass: 'snack-message',
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 2500
            });
          }
        });
      }
    });
  }

  fetchBanks(): void {
    this.rest.getBanks().subscribe(response => {
      if (response.success) {
        this.banks = response.data;
      }
    }, error => {});
  }

}
