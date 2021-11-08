import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InvestmentsService {
    
    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public fetchData(page: number = 1, numrecord: number = 20): Observable<any> {
        return this.http.post(`${this.constant.api}Capitals/GetMyInvestments`, {
            page,
            numrecord
        });
    }
}