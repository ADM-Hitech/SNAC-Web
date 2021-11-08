import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DashboardAdminService {
    
    constructor(
        private http: HttpClient,
        private constant: Constant,
        private router: Router
    ) {}

    public fetchComitionInterest(filter: any): Observable<any> {
        return this.http.post(`${this.constant.api}Dashboard/GetCommissionAndInterest`, filter);
    }

    public fetchCreditNumber(filter: any): Observable<any> {
        return this.http.post(`${this.constant.api}Dashboard/GetCredits`, filter);
    }

    public fetchInvestments(filter: any): Observable<any> {
        return this.http.post(`${this.constant.api}Dashboard/GetInvestment`, filter);
    }

    public fetchLiquidity(filter: any): Observable<any> {
        return this.http.post(`${this.constant.api}Dashboard/GetLiquidity`, filter);
    }
}