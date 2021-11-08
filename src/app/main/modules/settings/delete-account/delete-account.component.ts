import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalConfirmComponent } from '../../../../core/components/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteAccountComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private dialog: MatDialog) {
    this.matIconRegistry.addSvgIcon(
      'iconAlert',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-ajustes-eliminar-cuenta1.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconDeleteBtn',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/ico-borrar.svg')
    );
  }

  ngOnInit(): void {
  }

  delete(): void {
    this.dialog.open(ModalConfirmComponent, {
      data: {
        head: 'Eliminar Cuenta',
        title: '¿Estás seguro?',
        subTitle: '¡No podrás volver a entrar a la plataforma!'
      }
    });
  }
}
