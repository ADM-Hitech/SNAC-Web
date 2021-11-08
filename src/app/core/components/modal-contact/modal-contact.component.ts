import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Constant } from '../../services/constant';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-modal-contact',
  templateUrl: './modal-contact.component.html',
  styleUrls: ['./modal-contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalContactComponent implements OnInit {

  public formGroup: FormGroup;
  public formErrors: any;
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private constant: Constant,
    private snackBar: MatSnackBar,
  ) {
    this.formErrors = {
      name: {},
      mail: {},
      type: {},
      company: {},
      message: {},
      telephone: {},
      accept: {}
    };

    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: [''],
      company: ['', Validators.required],
      message: ['', Validators.required],
      telephone: ['', Validators.required],
      accept: [false, Validators.required]
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  ngOnInit() {
  }

  public get isAccepted(): boolean {
    return this.formGroup.get('accept').value as boolean;
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

  public submitForm(): void {
    this.loading = true;

    this.http.post(`${this.constant.api}contact`, this.formGroup.value).subscribe((response: any) => {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'EXITOSO',
          subMessage: 'Nos pondremos en contacto contigo',
          type: 'success'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2500
      });
    });
  }

}
