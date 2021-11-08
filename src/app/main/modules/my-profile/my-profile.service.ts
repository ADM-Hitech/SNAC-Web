import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MyProfileService {

    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public fetchMe(): Observable<any> {
        return this.http.get(`${this.constant.api}Users/GetUser`);
    }
}