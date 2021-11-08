import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../services/constant';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-edit-investor',
  templateUrl: './edit-investor.component.html',
  styleUrls: ['./edit-investor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditInvestorComponent {

  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    public dialogRef: MatDialogRef<EditInvestorComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private constant: Constant,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formErrors = {
      first_Name: {},
      last_Name: {},
      total_Amount_Agreed: {},
      start_Date_Prestaqi: {},
      limit_Date: {},
      rfc: {},
      institution_Id: {},
      clabe: {},
      account_Number: {},
      is_Moral_Person: {},
      mail: {}
    };

    this.formGroup = this.formBuilder.group({
      id: [data?.user?.id, Validators.required],
      first_Name: [data?.user?.first_Name, Validators.required],
      last_Name: [data?.user?.last_Name, Validators.required],
      total_Amount_Agreed: [data?.user?.total_Amount_Agreed, [Validators.required, Validators.pattern('^\\d*$')]],
      start_Date_Prestaqi: [data?.user?.start_Date_Prestaqi, Validators.required],
      limit_Date: [data?.user?.limit_Date, Validators.required],
      rfc: [data?.user?.rfc, Validators.required],
      institution_Id: [data?.user?.institution_Id, Validators.required],
      clabe: [data?.user?.clabe, [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
      account_Number: [data?.user?.account_Number, [
        Validators.required, Validators.pattern('^\\d*$'), Validators.minLength(1), Validators.maxLength(11)]],
      enabled: [data?.user?.enabled, Validators.required],
      is_Moral_Person: [data?.user?.is_Moral_Person, Validators.required],
      mail: [data?.user?.mail, [Validators.required, Validators.email]],
      first_Login: [data?.user?.first_Login ?? false]
    });

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

  submit(): void {
    this.loading = true;

    this.http.put(`${this.constant.api}Investors`, this.formGroup.value).subscribe((response: any) => {
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
      this.dialogRef.close(false);
      this.loading = false;
    });
  }
}
