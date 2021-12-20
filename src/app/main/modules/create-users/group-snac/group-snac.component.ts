import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatIconRegistry, MatSnackBar } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { SnakBarAlertComponent } from "src/app/core/components/snak-bar-alert/snak-bar-alert.component";
import { CreateUserService } from "../create-users.service";

@Component({
    selector: 'app-group-snac',
    templateUrl: './group-snac.component.html',
    styleUrls: ['./group-snac.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GroupSnacComponent implements AfterViewInit {

	@ViewChild('boxInput') boxInput: ElementRef;
	@ViewChild('inputFile') inputFile: ElementRef;
	public typeUser = 1;
	public arrayBuffer: Array<any>;
	public loading = false;
	public errors = '';
  public companies = [];
  public selectedCompany: number = null;

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

    this.getComopanies();
	}

	ngAfterViewInit(): void {
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

  private getComopanies(): void {
    this.rest.getCompanies().subscribe((response) => {
      this.companies = response.data;
    });
  }

	deleteDefaultEvent(event: DragEvent | any): void {
    event.preventDefault();
    event.stopPropagation();
  }

	public submit(): void {
		this.loading = true;

		this.rest.groupSnac(this.arrayBuffer, this.selectedCompany).subscribe((response) => {
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
		}, err => {
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