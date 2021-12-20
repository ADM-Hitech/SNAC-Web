import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatDialog, MatSnackBar, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { CreateUserService } from '../create-users.service';
import * as _moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SnakBarAlertComponent } from 'src/app/core/components/snak-bar-alert/snak-bar-alert.component';
import { ValidNumber, ValidNumberNotRequired } from 'src/app/core/validators';

const moment = _moment;

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'DD/MM'
        },
        display: {
          dateInput: 'DD/MM',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class LicenseComponent {

  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    private dialog: MatDialog,
    private rest: CreateUserService,
    private formBuild: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formErrors = {
      CostCenter: {},
      Name: {},
      NamePersonCharge: {},
      ContractNumber: {},
      LicenseNumber: {},
      DatePayment: {},
      Mail: {}
    };

    this.formGroup = this.formBuild.group({
      CostCenter: ['', Validators.required],
      Name: ['', Validators.required],
      NamePersonCharge: ['', Validators.required],
      ContractNumber: ['', Validators.required],
      LicenseNumber: [{ value: this.generateUUID(), disabled: true }],
      DatePayment: ['', Validators.required],
      Mail: ['', [Validators.required, Validators.email]],
      Prices: this.formBuild.array([]),
      ModelPrestaqi: [false],
      OriginatorAccount: ['', Validators.required]
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

    this.addPrices();
  }

  public get priceArray(): FormArray {
    return this.formGroup.get('Prices') as FormArray;
  }

  private onFormValuesChanged(): void {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      this.formErrors[field] = {};

      const control = this.formGroup.get(field);

      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }

  private generateUUID(): string {
    let date = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = (date + Math.random() * 16 ) % 16 | 0;
      date = Math.floor(date / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
  }

  public sumit(): void {
    this.loading = true;
    this.formGroup.get('LicenseNumber').enable();

    this.rest.createLicense(this.formGroup.value).subscribe((response) => {
      if (response.success) {
        this.showAlert('EXITOSO', response.message, 'success');

        this.formGroup.reset();

        while (this.priceArray.length !== 0) {
          this.priceArray.removeAt(0);
        }

        this.addPrices();

        this.formGroup.get('LicenseNumber').setValue(this.generateUUID());
      } else {
        this.showAlert('ERROR', response.message, 'error');
      }

      this.formGroup.get('LicenseNumber').disable();
      this.loading = false;
    }, (error) => {
      this.formGroup.get('LicenseNumber').disable();
      this.loading = false;
      this.showAlert('ERROR', 'Ocurrio un error inesperado por favor intentelo mas tarde', 'error');
    });
  }

  private showAlert(message: string, subMessage: string, type: 'error' | 'success' | 'warning') {
    this.snackBar.openFromComponent(SnakBarAlertComponent, {
      data: {
        message,
        subMessage,
        type
      },
      panelClass: 'snack-message',
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2500
    });
  }

  public getFielForm(field: string): AbstractControl {
    return this.formGroup.get(field);
  }

  public addPrices(): void {
    this.priceArray.push(this.formBuild.group({
      InitialQuantity: ['', ValidNumberNotRequired],
      FinalQuantity: ['', ValidNumberNotRequired],
      Cost: ['', [Validators.required, ValidNumber]],
      LicenseId: ['']
    }));
  }

  public deletePrice(index: number): void {
    this.priceArray.controls.splice(index, 1);
  }

  public errorInPrice(form: FormGroup, proprety: string): string {
    const input = form.get(proprety);

    if (input.hasError('required') || input.hasError('isNotNumber') || input.hasError('min')) {
      return 'el valor no es valido';
    }

    return null;
  }
}
