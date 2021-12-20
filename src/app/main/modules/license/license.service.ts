import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from 'src/app/core/services/constant';

@Injectable({
    providedIn: 'root'
})
export class LicenseService {

    constructor(private http: HttpClient, private constant: Constant) { }

    public fetchLicenses(Page: number = 1, NumRecord: number = 50, Filter: string = ''): Observable<any> {
        return this.http.get(`${this.constant.api}License?Page=${Page}&NumRecord=${NumRecord}&Filter=${Filter}`);
    }

    public fetchTableAccredited(page: number = 1, numrecord: number = 20, filter: string = '', licenseId: number): Observable<any> {
        return this.http.get(`${this.constant.api}License/Accredited?Page=${page}&NumRecord=${numrecord}&Filter=${filter}&id=${licenseId}`);
    }

    public fetchFounding(id: number, year: number, month: number): Observable<any> {
        return this.http.get(`${this.constant.api}License/FundingControl?LicenseId=${id}&Year=${year}&Month=${month}`);
    }

    public getInstitutions(): Observable<any> {
        return this.http.get(`${this.constant.api}Institutions/GetList`);
    }

    public getGender(): Observable<any> {
        return this.http.get(`${this.constant.api}Genders`);
    }

    public getCompanies(): Observable<any> {
        return this.http.get(`${this.constant.api}Companies/GetList`);
    }


    public getPeriodos(): Observable<any> {
        return this.http.get(`${this.constant.api}Periods/GetByType?type=2`);
    }

    public getTypeContract(): Observable<any> {
        return this.http.get(`${this.constant.api}TypeContract`);
    }

    public getLicenses(): Observable<any> {
        return this.http.get(`${this.constant.api}License/All`);
    }

    public deleteAccredited(id: number, type: number): Observable<any> {
        return this.http.put(`${this.constant.api}Administrative/ChangeStatusUser`, {
          userid: id,
          type,
          IsDelete: true
        });
      }

}
