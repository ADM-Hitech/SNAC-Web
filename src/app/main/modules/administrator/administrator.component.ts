import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdministratorService } from './administrator.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { EditAdminComponent } from '../../../core/components/edit-admin/edit-admin.component';
import { ModalConfirmComponent } from '../../../core/components/modal-confirm/modal-confirm.component';
import { SnakBarAlertComponent } from '../../../core/components/snak-bar-alert/snak-bar-alert.component';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdministratorComponent implements OnInit {

  public admins: Array<any> = [];
  public loading: boolean;

  constructor(
    private dialog: MatDialog,
    private rest: AdministratorService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.fetchAdmins();
  }

  fetchAdmins(): void {
    this.loading = true;

    this.rest.fetchAdmins().subscribe((response) => {
      if (response.success) {
        this.admins = response.data;
      }
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  editAdmin(admin: any): void {
    const dialog = this.dialog.open(EditAdminComponent, {
      data: {
        user: admin
      },
      panelClass: 'edit-admin-modal'
    });

    dialog.afterClosed().subscribe(
      (data) => { if (data) { this.fetchAdmins(); } }
    );
  }

  changeStatus(status: boolean, id: number, type: number): void {
    this.rest.changeStatus(id, type, status).subscribe((response) => {
      this.fetchAdmins();
    }, err => {

    });
  }

  delete(id: number, type: number): void {
    if (!this.permisitionEdit) {
      return;
    }

    const dialogRef = this.dialog.open(ModalConfirmComponent, {
      data: {
        head: 'Eliminar Administrador',
        title: '¿Estás seguro?',
        subTitle: '¡Los registros seran eliminados!'
      }
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.rest.delete(id, type).subscribe(res => {
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
            this.fetchAdmins();
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

  get permisitionEdit(): boolean {
    return this.auth.modules.some(item => item.Module === 'Modificar Administradores' || item.module === 'Modificar Administradores');
  }

}
