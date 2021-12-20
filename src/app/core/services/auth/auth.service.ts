import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JsonPipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtHelper: JwtHelperService;

  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!!!token) {
      return false;
    }
    return !this.jwtHelper.isTokenExpired(token);
  }

  public checkRols(roles: string[]): boolean {
    if (!!!roles) {
      return true;
    }
    return roles.some(r => r === this.getRol());
  }

  public getRol(): string {
    const token = localStorage.getItem('token');
    const user = this.jwtHelper.decodeToken(token);
    if (!!user) {
      return user.TypeName;
    }

    return '';
  }

  public get typeId(): number {
    const token = localStorage.getItem('token');
    const user = this.jwtHelper.decodeToken(token);
    if (!!user) {
      return user.Type;
    }

    return 0;
  }

  public get email(): string {
    const token = localStorage.getItem('token');
    const user = this.jwtHelper.decodeToken(token);
    if (!!user) {
      return user.email;
    }

    return '';
  }

  public get id(): number {
    const token = localStorage.getItem('token');
    const user = this.jwtHelper.decodeToken(token);
    if (!!user) {
      return user.UserId;
    }

    return 0;
  }

  public get rfc(): string {
    return localStorage.getItem('rfc') || '';
  }

  public get curp(): string {
    return localStorage.getItem('curp') || '';
  }

  public get modules(): Array<any> {
    const token = localStorage.getItem('token');
    const user = this.jwtHelper.decodeToken(token);
    try {
      if (!!user && !!user.Roles) {
        return JSON.parse(user.Roles);
      }
    }catch (e) {}

    return [];
  }
}
