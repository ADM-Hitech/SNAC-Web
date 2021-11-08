import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditInvestorComponent } from 'src/app/core/components/edit-investor/edit-investor.component';
import { CreateUserService } from '../create-users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnakBarAlertComponent } from '../../../../core/components/snak-bar-alert/snak-bar-alert.component';


@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvestorComponent implements OnInit {

  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;
  public instituciones: Array<any> = [];

  constructor(
    private dialog: MatDialog,
    private rest: CreateUserService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.formErrors = {
      first_name: {},
      last_name: {},
      total_amount_agreed: {},
      start_date_prestaqi: {},
      limit_date: {},
      rfc: {},
      institution_id: {},
      clabe: {},
      account_number: {},
      is_moral_person: {},
      mail: {}
    };
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      total_amount_agreed: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      start_date_prestaqi: ['', Validators.required],
      limit_date: ['', Validators.required],
      rfc: ['', Validators.required],
      institution_id: [1, Validators.required],
      clabe: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      account_number: ['', [Validators.required, Validators.pattern('^\\d*$'), Validators.minLength(1), Validators.maxLength(11)]],
      enabled: [true, Validators.required],
      is_moral_person: [false, Validators.required],
      mail: ['', [Validators.required, Validators.email]]
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });

    this.fetchIntituciones();
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

  edit(user: any): void {
    this.dialog.open(EditInvestorComponent, {
      data: {
        user,
        instituciones: this.instituciones
      },
      panelClass: 'edit-investor-modal'
    });
  }

  submit(): void {
    this.loading = true;

    this.rest.createInvestor(this.formGroup.value).subscribe(response => {
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
    }, err => {});
  }

}
