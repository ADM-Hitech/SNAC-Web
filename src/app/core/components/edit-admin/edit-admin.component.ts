import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CreateUserService } from '../../../main/modules/create-users/create-users.service';
import { MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../services/constant';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditAdminComponent implements OnInit {

  public modules: Array<any> = [];
  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest: CreateUserService,
    private http: HttpClient,
    private constant: Constant,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAdminComponent>,
  ) {

    this.formErrors = {
      first_name: {},
      last_name: {},
      mail: {},
      phone: {},
      employee_number: {}
    };

    this.formGroup = this.formBuilder.group({
      id: [data.user.id],
      first_name: [data.user.first_Name, Validators.required],
      last_name: [data.user.last_Name, Validators.required],
      mail: [data.user.mail, [Validators.required, Validators.email]],
      phone: [data.user.phone, [Validators.required, Validators.minLength(10)]],
      employee_number: [data.user.employee_Number, Validators.required],
      modules: this.formBuilder.array(data.user.modules, Validators.minLength(1)),
      enabled: [data.user.enabled]
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  get arrayModules(): FormArray {
    return this.formGroup.get('modules') as FormArray;
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

  ngOnInit() {
    this.fetchModules();

    /*this.data.user.modules.forEach((module) => {
      this.arrayModules.push(this.formBuilder.control({
        module_id: module.id
      }))
    });*/
  }

  checkModule(module: any, event): void {
    if (event.checked) {
      this.arrayModules.push(this.formBuilder.control({
        module_id: module.id
      }));
    } else {
      const valuePre = this.arrayModules.value.findIndex(m => m.module_id === module.id);
      this.arrayModules.removeAt(valuePre);
    }
  }

  findModule(module: any): boolean {
    return !!this.arrayModules.value.find(m => m !== null && m.module_id === module.id);
  }

  fetchModules(): void {
    this.rest.fetchModule().subscribe((response) => {
      if (response.success) {
        this.modules = response.data;
      }
    }, (error) => {});
  }

  public submit(): void {
    this.loading = true;

    this.http.put(`${this.constant.api}Users`, this.formGroup.value).subscribe((response: any) => {
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
      this.dialogRef.close(true);
      this.loading = false;
    }, error => {
      this.dialogRef.close(true);
      this.loading = false;
    });
  }

}
