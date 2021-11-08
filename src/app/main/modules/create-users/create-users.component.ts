import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateUsersComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  activeMenu(menu: string) {
    return this.router.url.includes(menu);
  }

  isIndex() {
    return this.router.url === '/users/create-users';
  }

}
