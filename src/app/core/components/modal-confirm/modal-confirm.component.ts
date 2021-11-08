import { Component, OnInit, Inject, Input, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalConfirmComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.matIconRegistry.addSvgIcon(
      'iconSecurity',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-alerta.svg')
    );
  }

  ngOnInit() {
  }

}
