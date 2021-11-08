import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CreateUserService } from '../create-users.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { SnakBarAlertComponent } from '../../../../core/components/snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdministratorComponent implements OnInit {

  public modules: Array<any> = [];
  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private rest: CreateUserService,
    private snackBar: MatSnackBar
  ) {
    this.formErrors = {
      first_name: {},
      last_name: {},
      mail: {},
      phone: {},
      employee_number: {}
    };

    this.formGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      employee_number: ['', Validators.required],
      enabled: [true],
      modules: this.formBuilder.array([], Validators.minLength(1))
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

  ngOnInit(): void {
    this.fetchModules();
  }

  fetchModules(): void {
    this.rest.fetchModule().subscribe((response) => {
      if (response.success) {
        this.modules = response.data;
        const findDash = this.modules.find(m => m !== null && m.description === 'Dashboard');
        if (!!findDash) {
          this.checkModule(findDash, {checked: true});
        }
      }
    }, (error) => {});
  }

  submit(): void {
    this.loading = true;

    this.rest.createAdmin(this.formGroup.value).subscribe((response) => {
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

        this.arrayModules.clear();
        this.modules = [...this.modules];
      }

      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  get arrayModules(): FormArray {
    return this.formGroup.get('modules') as FormArray;
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

}
