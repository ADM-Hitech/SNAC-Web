import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-section-employer',
  templateUrl: './section-employer.component.html',
  styleUrls: ['./section-employer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionEmployerComponent implements OnInit {

  @Output() contact = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  openDialogContact() {
    this.contact.emit();
  }

}
