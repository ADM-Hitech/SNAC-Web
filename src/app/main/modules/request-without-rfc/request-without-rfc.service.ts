import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Constant } from "src/app/core/services/constant";

@Injectable({
    providedIn: 'root'
})
export class RequestWithoutRfcService {

    constructor(
        private readonly http: HttpClient,
        private readonly constant: Constant,
        private readonly auth: AuthService
    ) {}

    public getRequests(): Observable<any> {
        return this.http.get(`${this.constant.api}Register`);
    }

    public getRequestOnlyRfc(): Observable<any> {
        return this.http.get(`${this.constant.api}Register/OnlyRfc`);
    }

    public deleteRequest(ids: Array<number>): Observable<any> {
        return this.http.post(`${this.constant.api}Register/Delete`, {
            ids
        });
    }

    public sendNotification(ids: Array<number>): Observable<any> {
        return this.http.post(`${this.constant.api}Register/SendNotification`, {
            ids
        });
    }
}