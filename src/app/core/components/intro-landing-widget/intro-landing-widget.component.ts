import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-intro-landing-widget',
  templateUrl: './intro-landing-widget.component.html',
  styleUrls: ['./intro-landing-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IntroLandingWidgetComponent implements OnInit {

  @Input() imagePath;
  @Input() text;
  @Input() radiusTopLeft = false;
  @Input() radiusTopRight = false;
  @Input() radiusBottomLeft = false;
  @Input() radiusBottomRight = false;

  constructor() { }

  ngOnInit() {
  }

}
