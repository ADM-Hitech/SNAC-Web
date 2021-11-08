import { Component, OnInit, ViewEncapsulation, Input, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-widget-user',
  templateUrl: './widget-user.component.html',
  styleUrls: ['./widget-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetUserComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() name: string;
  @Input() position: string;
  @Input() email: string;
  @Input() telephone: string;
  @Input() active: boolean;
  @Input() editing: boolean;
  @Output() editUser = new EventEmitter<any>();
  @Output() changeStatus = new EventEmitter<any>();
  @Output() eventDelete = new EventEmitter<any>();

  public enable: boolean;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {
    this.matIconRegistry.addSvgIcon(
      'iconEdit',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-editar.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconDelete',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-borrar.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconMail',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-correo.svg')
    );

    this.matIconRegistry.addSvgIcon(
      'iconPhone',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-telefono.svg')
    );

    this.enable = false;
  }

  ngAfterViewInit(): void {
    if (!!this.id) {
      this.id = this.id.toString().padStart(2, '0');
      this.cdRef.detectChanges();
    }
  }

  ngOnInit(): void {
  }

  edit(): void {
    this.editUser.emit();
  }

  statusChange(value: boolean): void {
   this.changeStatus.emit(value);
  }

  delete(): void {
    this.eventDelete.emit();
  }

}
