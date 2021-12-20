import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../services/constant';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-edit-accredited',
  templateUrl: './edit-accredited.component.html',
  styleUrls: ['./edit-accredited.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditAccreditedComponent implements OnInit {

  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;
  public daysOfWeeks: Array<{id: number, label: string}> = [{
    id: 0,
    label: 'Domingo'
  }, {
    id: 1,
    label: 'Lunes'
  }, {
    id: 2,
    label: 'Martes'
  }, {
    id: 3,
    label: 'Miércoles'
  }, {
    id: 4,
    label: 'Jueves'
  }, {
    id: 5,
    label: 'Viernes'
  }, {
    id: 6,
    label: 'Sábado'
  }];

  constructor(
    public dialogRef: MatDialogRef<EditAccreditedComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private constant: Constant,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.formErrors = {
      first_name: {},
      last_name: {},
      Company_Id: {},
      identify: {},
      contract_number: {},
      position: {},
      net_monthly_salary: {},
      rfc: {},
      interest_rate: {},
      seniority_company: {},
      birth_date: {},
      age: {},
      gender_id: {},
      clabe: {},
      account_number: {},
      enabled: {},
      moratoruim_interest_rate: {},
      period_id: {},
      mail: {},
      mail_mandate_latter: {},
      institution_id: {},
      address: {},
      colony: {},
      municipality: {},
      zip_code: {},
      state: {},
      type_contract_id: {},
      end_day_payment: {},
      gross_monthly_salary: {},
      other_obligations: {},
      Outsourcing_Id: {},
      Period_Start_Date: {},
      Period_End_Date: {},
      License_Id: {},

      curp: {},
      numberEmployee: {}
    };

    this.formGroup = this.formBuilder.group({
      id: [data?.user?.id],
      first_name: [data?.user?.first_Name, Validators.required],
      last_name: [data?.user?.last_Name, Validators.required],
      Company_Id: [data?.user?.company_Id, Validators.required],
      identify: [data?.user?.identify, Validators.required],
      contract_number: [data?.user?.contract_number, Validators.required],
      position: [data?.user?.position, Validators.required],
      net_monthly_salary: [data?.user?.net_Monthly_Salary, Validators.required],
      rfc: [data?.user?.rfc, Validators.required],
      interest_rate: [data?.user?.interest_Rate, Validators.required],
      seniority_company: [data?.user?.seniority_Company, Validators.required],
      birth_date: [data?.user?.birth_Date, Validators.required],
      age: [data?.user?.age, [Validators.required, Validators.pattern('^\\d*$')]],
      gender_id: [data?.user?.gender_Id, Validators.required],
      clabe: [data?.user?.clabe, [Validators.required]],
      account_number: [data?.user?.account_Number, [Validators.required]],
      enabled: [data?.user?.enabled, Validators.required],
      moratoruim_interest_rate: [data?.user?.moratoruim_Interest_Rate, Validators.required],
      period_id: [data?.user?.period_Id, Validators.required],
      mail: [data?.user?.mail, [Validators.required, Validators.email]],
      mail_mandate_latter: [data?.user?.mail_Mandate_Latter],
      institution_id: [data?.user?.institution_Id, Validators.required],
      address: [data?.user?.address ?? '-', Validators.required],
      colony: [data?.user?.colony ?? '-', Validators.required],
      municipality: [data?.user?.municipality ?? '-', Validators.required],
      zip_code: [data?.user?.zip_Code ?? '00000', [
          Validators.required, Validators.pattern('^\\d*$'), Validators.minLength(5), Validators.maxLength(5)
        ]
      ],
      state: [data?.user?.state, Validators.required],
      type_contract_id: [data?.user?.type_Contract_Id, Validators.required],
      end_day_payment: [data?.user?.end_Day_Payment, Validators.required],
      first_Login: [data?.user?.first_Login ?? false],
      gross_monthly_salary: [data?.user?.gross_Monthly_Salary, Validators.required],
      other_obligations: [data?.user?.other_Obligations, Validators.required],
      Outsourcing_Id: [data?.user?.outsourcing_id],
      Period_Start_Date: [data?.user?.period_Start_Date, [Validators.required, Validators.min(1), Validators.max(31) ]],
      Period_End_Date: [data?.user?.period_End_Date, [Validators.min(1), Validators.max(31)]],
      License_Id: [data?.user?.license_Id],
      curp: [data?.user?.curp, Validators.required],
      numberEmployee: [data?.user?.numberEmployee]
    });

    this.changePeriodic(data?.user?.period_Id);
    this.formGroup.get('Period_Start_Date').setValue(data?.user?.period_Start_Date);
    this.formGroup.get('Period_End_Date').setValue(data?.user?.period_End_Date);
  }

  ngOnInit(): void {

    this.formGroup.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
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

  public submit(): void {
    if (this.periodicIsQuincenal && this.formGroup.get('Period_Start_Date').value >= this.formGroup.get('Period_End_Date').value) {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR FECHAS',
          subMessage: 'La fecha de pago 1 no puede ser mayor a la fecha de pago 2',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3500
      });
      return;
    }

    if (this.periodicIsQuincenal && (this.formGroup.get('Period_End_Date').value - this.formGroup.get('Period_Start_Date').value) > 15) {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR FECHAS',
          subMessage: 'El lapso de las fechas de pago superan los 15 días',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3500
      });
      return;
    }

    if (this.periodicIsQuincenal && (this.formGroup.get('Period_End_Date').value - this.formGroup.get('Period_Start_Date').value) < 14) {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR FECHAS',
          subMessage: 'El lapso de las fechas de pago son menores a 15 días',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3500
      });
      return;
    }

    this.loading = true;

    this.http.put(`${this.constant.api}Accrediteds`, this.formGroup.value).subscribe((response: any) => {
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

        this.dialogRef.close(true);

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

        this.dialogRef.close(false);
      }

      this.loading = false;
    }, error => {
      this.loading = false;
      this.dialogRef.close(false);
    });
  }

  get periodicIsWeek(): boolean {
    return this.data?.periodos?.find(e => e.id === this.formGroup.get('period_id').value)?.description === 'Semanal';
  }

  get periodicIsQuincenal(): boolean {
    return this.data?.periodos?.find(e => e.id === this.formGroup.get('period_id').value)?.description === 'Quincenal';
  }

  changePeriodic(value: number): void {
    if (this.data?.periodos?.find(e => e.id === value)?.description !== 'Quincenal') {
      this.formGroup.get('Period_End_Date').clearValidators();
      this.formGroup.get('Period_End_Date').disable();
    } else {
      this.formGroup.get('Period_End_Date').setValidators([Validators.required, Validators.min(1), Validators.max(31)]);
      this.formGroup.get('Period_End_Date').enable();
    }
    this.formGroup.get('Period_Start_Date').setValue(1);
    this.formGroup.get('Period_End_Date').setValue('');
  }

}
