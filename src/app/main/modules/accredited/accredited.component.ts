import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AccreditedService } from './accredited.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatDialog, MatSnackBar, MatInput } from '@angular/material';
import { forkJoin } from 'rxjs';
import { ModalConfirmComponent } from '../../../core/components/modal-confirm/modal-confirm.component';
import { SnakBarAlertComponent } from '../../../core/components/snak-bar-alert/snak-bar-alert.component';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-accredited',
  templateUrl: './accredited.component.html',
  styleUrls: ['./accredited.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccreditedComponent implements OnInit {

  public data: Array<any> = [];
  public genders: Array<any> = [];
  public institutions: Array<any> = [];
  public companies: Array<any> = [];
  public periodos: Array<any> = [];
  public typeContracts: Array<any> = [];
  public licenses: Array<any> = [];
  @ViewChild('Filter') filter: MatInput;
  public filterControl = new FormControl();

  public totalRow = 0;
  public loading = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private rest: AccreditedService,
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
    this.getCatalogs();

    this.filterControl.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.onSearchChange(value);
      });
  }

  fetchData(page: number = 1, numrecord: number = 20, filter: string = ''): void {
    this.loading = true;

    this.rest.fetchTableAccredited(page, numrecord, filter).subscribe((response) => {
      if (response.success) {
        this.data = response.data.accrediteds;
        this.totalRow = response.data.totalRecord;
      }
      else {
        window.open(response);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  onSearchChange(data: string) {
      this.fetchData(1, 20, data);
  }

  changePage(event): void {
    this.fetchData(event.pageIndex + 1, event.pageSize, this.filter.value);
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

  getCatalogs(): void {
    forkJoin(
      this.rest.getGender(),
      this.rest.getInstitutions(),
      this.rest.getCompanies(),
      this.rest.getPeriodos(),
      this.rest.getTypeContract(),
      this.rest.getLicenses()
    ).subscribe(response => {
      this.genders = response[0].data;
      this.institutions = response[1].data;
      this.companies = response[2].data;
      this.periodos = response[3].data;
      this.typeContracts = response[4].data;
      this.licenses = response[5].data;
    }, error => {

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

}
