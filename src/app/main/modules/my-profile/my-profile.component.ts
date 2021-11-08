import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MyProfileService } from './my-profile.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MyProfileComponent implements OnInit {

  public username: string;
  public user: any;
  public loading = true;
  public rol: string;

  constructor(
    private rest: MyProfileService,
    private auth: AuthService
  ) {
    this.rol = this.auth.getRol();
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('completeName');
    this.getMe();
  }

  getMe(): void {
    this.rest.fetchMe().subscribe((response) => {
      if (response.success) {
        this.user = response.data;
      }

      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }
}
