import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-icon-user',
  templateUrl: './icon-user.component.html',
  styleUrls: ['./icon-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IconUserComponent implements OnInit {

  @Input() height;
  @Input() width;
  @Input() padding;
  @Input() fontSize;
  @Input() bgColor;
  @Input() color;
  @Input() fontFamily;
  @Input() cls;
  @Input() nameUser;

  public letterName = '';

  constructor() { }

  ngOnInit(): void {
    if (!!this.nameUser) {
      var split = this.nameUser.split(' ');
      this.letterName = (split[0][0] ?? '') + (split[1][0] ?? '');
    }
  }

}
