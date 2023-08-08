import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Constant } from "src/app/core/services/constant";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LugarTrabajoService {

    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public getAll(): Observable<any> {
        return this.http.get(`${this.constant.api}lugarestrabajo`);
    }

    public updateStatus(id: number): Observable<any> {
        return this.http.put(`${this.constant.api}lugarestrabajo/?id=${id}`, {
            id
        });
    }
}