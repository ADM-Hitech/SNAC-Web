import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Constant } from '../../services/constant';
import { SnakBarAlertComponent } from '../snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-preview-document',
  templateUrl: './preview_document.component.html',
  styleUrls: ['./preview_document.component.scss']
})
export class PreviewDocumentComponent implements OnInit {

  public message: string;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      path: string | Array<string>,
      type: 'image' | 'pdf' | Array<'image' | 'pdf'>
    },
    public dialogRef: MatDialogRef<PreviewDocumentComponent>,
    private constant: Constant
  ) {
    this.dialogRef.disableClose = true;
    if (!Array.isArray(this.data.path)) {
      this.data.path = [this.data.path];
      if (!Array.isArray(this.data.type)) {
        this.data.type = [this.data.type];
      }
    }
    
    this.data.path = this.data.path.map((item) => item.includes('http') ? item : `${this.constant.api.replace('api/', '')}${item.split('/').pop()}`);
  }

  ngOnInit() {
  }

  public close(value: boolean): void {
    if (!value && !!!this.message) {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'REQUIERE',
          subMessage: 'Ingrese un motivo de rechazo',
          type: 'warning'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2500
      });

      return;
    }

    this.dialogRef.close({
      approve: value,
      message: this.message
    });
  }

  public getNameFile(path: string): string {
    const split = path.split('/');

    return split[split.length - 1];
  }

}
