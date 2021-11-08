import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { appAnimations } from 'src/app/core/animations';

@Component({
  selector: 'app-section-video',
  templateUrl: './section-video.component.html',
  styleUrls: ['./section-video.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: appAnimations
})
export class SectionVideoComponent implements OnInit {

  public isPlaying = false;
  public playerVars = {
    controls: 0
  };
  public width = 810;

  @Output() contact = new EventEmitter<any>();
  @ViewChild('player') player: any;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 810) {
      this.width = event.target.innerWidth * .9;
    } else {
      this.width = 810;
    }
  }

  constructor() {}

  ngOnInit(): void {
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    if (document.body.clientWidth < 810 ) {
      this.width = document.body.clientWidth * .9;
    }
  }

  // Autoplay
  onReady(event) {
    // this.player.mute();
  }

  // Loop
  onStateChange(event) {
    if (event.data === 0) {
      this.player.playVideo();
    }
  }

  playVideo(): void {
    this.player.playVideo();
    this.isPlaying = true;
  }

  openDialogContact() {
    this.contact.emit();
  }
}
