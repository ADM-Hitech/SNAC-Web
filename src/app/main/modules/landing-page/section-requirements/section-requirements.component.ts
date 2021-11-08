import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-section-requirements',
  templateUrl: './section-requirements.component.html',
  styleUrls: ['./section-requirements.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionRequirementsComponent implements OnInit {

  @Output() contact = new EventEmitter<any>();
  @Output() registre = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  openDialogContact(): void {
    this.registre.emit();
  }

  toContact(): void {
    this.contact.emit();
  }

}
