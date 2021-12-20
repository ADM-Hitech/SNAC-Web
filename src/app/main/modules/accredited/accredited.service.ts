import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../../../core/services/constant';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AccreditedService {

  constructor(
    private http: HttpClient,
    private constant: Constant
  ) { }

  public fetchTableAccredited(page: number = 1, numrecord: number = 20, filter: string = ''): Observable<any> {
    return this.http.post(`${this.constant.api}Accrediteds/GetList`, {
      page,
      numrecord,
      filter
    });
  }

  public fetchFile(type: number) {
    return this.http.get(`${this.constant.api}Accrediteds/GetFile?type=` + type,
      {responseType: 'blob'})
      .pipe(
        map(
          res => {
            return {
              filename: type === 1 ? 'Acreditados.xlsx' : 'Acreditados.pdf',
              data: res
            };
          }
        )
      );
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

  public delete(id: number, type: number): Observable<any> {
    return this.http.put(`${this.constant.api}Administrative/ChangeStatusUser`, {
      userid: id,
      type,
      IsDelete: true
    });
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
}
