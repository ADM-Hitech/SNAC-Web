import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatDialogRef, MatSnackBar, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_DIALOG_DATA } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Constant } from '../../services/constant';
import { ValidNumber, ValidNumberNotRequired } from '../../validators';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
    selector: 'app-edit-license',
    templateUrl: './edit-license.component.html',
    styleUrls: ['./edit-license.component.scss'],
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
export class EditLicenseComponent implements OnInit {

    public formGroup: FormGroup;
    public formErrors: any;
    public loading = false;

    constructor(
        public dialogRef: MatDialogRef<EditLicenseComponent>,
        private formBuild: FormBuilder,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private constant: Constant,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        this.formErrors = {
            CostCenter: {},
            Name: {},
            NamePersonCharge: {},
            ContractNumber: {},
            LicenseNumber: {},
            DatePayment: {},
            OriginatorAccount: {}
        };

        this.formGroup = this.formBuild.group({
            id: [data.id, Validators.required],
            CostCenter: [data.CostCenter, Validators.required],
            Name: [data.Name, Validators.required],
            NamePersonCharge: [data.NamePersonCharge, Validators.required],
            ContractNumber: [data.ContractNumber, Validators.required],
            LicenseNumber: [{ value: data.LicenseNumber, disabled: true }],
            DatePayment: [data.DatePayment, Validators.required],
            Prices: this.formBuild.array([]),
            ModelPrestaqi: [data.ModelPrestaqi],
            OriginatorAccount: [data.OriginatorAccount, Validators.required]
          });

        this.formGroup.valueChanges.subscribe(() => {
            this.onFormValuesChanged();
        });

        if (this.data.Prices.length <= 0) {
          this.addPrices();
        }
    }

    public ngOnInit() {
      if (this.priceArray.controls.length <= 0) {
        this.data.Prices.forEach(element => {
          this.addPrices(element.initialQuantity, element.finalQuantity, element.cost, element.licenseId);
        });
      }
    }

    public get priceArray(): FormArray {
      return this.formGroup.get('Prices') as FormArray;
    }

    public submit(): void {
        this.loading = true;

        this.http.put(`${this.constant.api}License`, this.formGroup.value).subscribe((response: any) => {
          if (response.success) {
            this.showAlert('EXITOSO', response.message, 'success');

            this.dialogRef.close(true);
          } else {
            this.showAlert('ERROR', response.message, 'error');
          }

          this.loading = false;
        }, (error) => {
          this.loading = false;
          this.showAlert('ERROR', 'Ocurrio un error inesperado por favor intentelo mas tarde', 'error');
        });
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

    public addPrices(initial = '', final = '', cost = '', licenseid = ''): void {
      this.priceArray.push(this.formBuild.group({
        InitialQuantity: [initial, ValidNumberNotRequired],
        FinalQuantity: [final, ValidNumberNotRequired],
        Cost: [cost, [Validators.required, ValidNumber]],
        LicenseId: [licenseid]
      }));
    }

    public errorInPrice(form: FormGroup, proprety: string): string {
      const input = form.get(proprety);

      if (input.hasError('required') || input.hasError('isNotNumber') || input.hasError('min')) {
        return 'el valor no es valido';
      }

      return null;
    }

    public deletePrice(index: number): void {
      this.priceArray.removeAt(index);
    }
}
