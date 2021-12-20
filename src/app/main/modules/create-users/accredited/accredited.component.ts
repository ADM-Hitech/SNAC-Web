import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateUserService } from '../create-users.service';
import { MatSnackBar } from '@angular/material';
import { SnakBarAlertComponent } from '../../../../core/components/snak-bar-alert/snak-bar-alert.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-accredited',
  templateUrl: './accredited.component.html',
  styleUrls: ['./accredited.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccreditedComponent implements OnInit {

  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;
  public instituciones: Array<any> = [];
  public genders: Array<any> = [];
  public periodos: Array<any> = [];
  public typeContract: Array<any> = [];
  public licenses: Array<any> = [];
  public loadingCatalog = false;
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
  public daysInMonth: Array<number> = Array.from({length: 31}, (_, i) => i + 1);

  constructor(
    private rest: CreateUserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formErrors = {
      first_name: {},
      last_name: {},
      Company_Name: {},
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
      Outsourcing_Name: {},
      Period_Start_Date: {},
      Period_End_Date: {},
      License_Id: {}
    };
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      Company_Name: ['', Validators.required],
      identify: ['', Validators.required],
      contract_number: ['', Validators.required],
      position: ['', Validators.required],
      net_monthly_salary: ['', Validators.required],
      rfc: ['', Validators.required],
      interest_rate: ['', Validators.required],
      seniority_company: ['', Validators.required],
      birth_date: ['', Validators.required],
      age: [0, [Validators.required, Validators.pattern('^\\d*$')]],
      gender_id: ['', Validators.required],
      clabe: ['', [Validators.required]],
      account_number: ['', [Validators.required]],
      enabled: [true, Validators.required],
      moratoruim_interest_rate: ['', Validators.required],
      period_id: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      mail_mandate_latter: ['', [Validators.required, Validators.email]],
      institution_id: ['', Validators.required],
      address: ['', Validators.required],
      colony: ['', Validators.required],
      municipality: ['', Validators.required],
      zip_code: ['', [Validators.required, Validators.pattern('^\\d*$'), Validators.minLength(5), Validators.maxLength(5)]],
      state: ['', Validators.required],
      type_contract_id: ['', Validators.required],
      end_day_payment: [''],
      gross_monthly_salary: ['', Validators.required],
      other_obligations: ['', Validators.required],
      Outsourcing_Name: [''],
      Period_Start_Date: ['', Validators.required],
      Period_End_Date: [''],
      License_Id: ['']
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

    this.fetchCatalog();
  }

  private fetchCatalog(): void {
    this.loadingCatalog = true;

    forkJoin([
      this.rest.getTypeContract(),
      this.rest.getPeriodos(2),
      this.rest.getGender(),
      this.rest.getInstitutions(),
      this.rest.getLicenses()
    ]).subscribe((response) => {
      if (response[0].success) {
        this.typeContract = response[0].data;
      }

      if (response[1].success) {
        this.periodos = response[1].data;
      }

      if (response[2].success) {
        this.genders = response[2].data;
      }

      if (response[3].success) {
        this.instituciones = response[3].data;
      }

      if (response[4].success) {
        this.licenses = response[4].data;
      }

      this.loadingCatalog = false;
    }, err => {});
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

  submit(): void {
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

    this.rest.createAccredited(this.formGroup.value).subscribe(response => {
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

        this.formGroup.reset();
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

      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  fetchIntituciones(): void {
    this.rest.getInstitutions().subscribe((response) => {
      if (response.success) {
        this.instituciones = response.data;
      }
    }, err => {

    });
  }

  fetchGender(): void {
    this.rest.getGender().subscribe((response) => {
      if (response.success) {
        this.genders = response.data;
      }
    }, err => {

    });
  }

  fetchPeriodo(): void {
    this.rest.getPeriodos(2).subscribe((response) => {
      if (response.success) {
        this.periodos = response.data;
      }
    }, err => {});
  }

  fetchTypeContract(): void {
    this.rest.getTypeContract().subscribe((response) => {
      if (response.success) {
        this.typeContract = response.data;
      }
    }, err => {});
  }

  get periodicIsWeek(): boolean {
    return this.periodos?.find(e => e.id === this.formGroup.get('period_id').value)?.description === 'Semanal';
  }

  get periodicIsQuincenal(): boolean {
    return this.periodos?.find(e => e.id === this.formGroup.get('period_id').value)?.description === 'Quincenal';
  }

  changePeriodic(value: number): void {
    if (this.periodos?.find(e => e.id === value)?.description !== 'Quincenal') {
      this.formGroup.get('Period_End_Date').disable();
      this.formGroup.get('Period_End_Date').clearValidators();
    } else {
      this.formGroup.get('Period_End_Date').enable();
      this.formGroup.get('Period_End_Date').setValidators([Validators.required]);
    }
  }
}
