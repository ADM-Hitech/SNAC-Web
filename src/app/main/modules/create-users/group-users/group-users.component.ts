import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateUserService } from '../create-users.service';
import { SnakBarAlertComponent } from '../../../../core/components/snak-bar-alert/snak-bar-alert.component';

@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrls: ['./group-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GroupUsersComponent implements OnInit, AfterViewInit {

  @ViewChild('boxInput') boxInput: ElementRef;
  @ViewChild('inputFile') inputFile: ElementRef;
  public typeUser = 1;
  public arrayBuffer: Array<any>;
  public loading = false;
  public errors = '';

  public labelInput = 'Arrasta y suelta o haz click para buscar en tu equipo el archivo .CSV';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private rest: CreateUserService,
    private snackBar: MatSnackBar
  ) {
    this.matIconRegistry.addSvgIcon(
      'logoUpload',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-subir-archivo.svg')
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('click', (event) => {
      (this.inputFile.nativeElement as HTMLInputElement).click();
    });

    (this.inputFile.nativeElement as HTMLInputElement).addEventListener('change', (event) => {
      this.deleteDefaultEvent(event);
      const files = (event.target as HTMLInputElement).files;
      if (files.length > 0) {
        this.labelInput = files[0].name;
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          const arrayBuffer = fileReader.result;
          const bytes = new Uint8Array(arrayBuffer as any);
          this.arrayBuffer = [...bytes];
        };

        fileReader.readAsArrayBuffer(files[0]);
      }
    });

    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('drag', (event) => {
      this.deleteDefaultEvent(event);
    });
    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragstart', (event) => {
      this.deleteDefaultEvent(event);
    });
    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragend', (event) => {
      this.deleteDefaultEvent(event);
    });
    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragover', (event) => {
      this.deleteDefaultEvent(event);
    });
    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragenter', (event) => {
      this.deleteDefaultEvent(event);
    });
    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('dragleave', (event) => {
      this.deleteDefaultEvent(event);
    });

    (this.boxInput.nativeElement as HTMLDivElement).addEventListener('drop', (event) => {
      this.deleteDefaultEvent(event);
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.labelInput = files[0].name;
        const fileReader = new FileReader();

        fileReader.onload = (e) => {
          const arrayBuffer = fileReader.result;
          const bytes = new Uint8Array(arrayBuffer as any);
          this.arrayBuffer = [...bytes];
        };

        fileReader.readAsArrayBuffer(files[0]);
      }
    });
  }

  deleteDefaultEvent(event: DragEvent | any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  submit(): void {
    this.loading = true;

    this.rest.groupUser(this.arrayBuffer, this.typeUser).subscribe((response) => {
      if (response.success) {
        this.snackBar.openFromComponent(SnakBarAlertComponent, {
          data: {
            message: 'EXITOSO',
            subMessage: 'Usuarios Registrados',
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
            subMessage: 'Verifique el archivo',
            type: 'error'
          },
          panelClass: 'snack-message',
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2500
        });
      }
      this.loading = false;
      this.errors = response.message.replace(/\n/g, '<br>');
    }, error => {
      this.snackBar.openFromComponent(SnakBarAlertComponent, {
        data: {
          message: 'ERROR',
          subMessage: 'Verifica el archivo',
          type: 'error'
        },
        panelClass: 'snack-message',
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2500
      });
      this.loading = false;
    });
  }
}
