import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../../core/services/constant';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdministratorService {

    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public fetchAdmins(): Observable<any> {
        return this.http.get(`${this.constant.api}Users/GetList`);
    }

    public delete(id: number, type: number): Observable<any> {
        return this.http.put(`${this.constant.api}Administrative/ChangeStatusUser`, {
            userid: id,
            type,
            IsDelete: true
        });
    }

    public changeStatus(id: number, type: number, value: boolean): Observable<any> {
        return this.http.put(`${this.constant.api}Administrative/ChangeStatusUser`, {
            userid: id,
            type,
            value,
            IsDelete: false
        });
    }
}