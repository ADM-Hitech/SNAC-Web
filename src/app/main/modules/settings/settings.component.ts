import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {}

  goTo(router: string) {
    this.router.navigate([router]);
  }

  activeMenu(menu: string): boolean {
    return this.router.url.includes(menu);
  }

  isIndex(): boolean {
    return this.router.url === '/settings';
  }

}
