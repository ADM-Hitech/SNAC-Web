import { HttpClient } from '@angular/common/http';
import { Constant } from '../../../core/services/constant';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvestorService {

  constructor(
    private http: HttpClient,
    private constant: Constant
  ) { }

  public fetchPeriodic(): Observable<any> {
    return this.http.get(`${this.constant.api}Periods/GetByType?type=1`);
  }

  public fetchTableInvestors(
    page: number = 1,
    numRecord: number = 20,
    filter: string = ''
  ): Observable<any> {
    const data = {
      page,
      numRecord,
      filter
    };

    return this.http.post(`${this.constant.api}Investors/GetInvestors`, data);
  }

  public newCallCapital(callCapital: any): Observable<any> {
    return this.http.post(`${this.constant.api}Capitals`, callCapital);
  }

  public fetchFile(type: number) {
    return this.http.get(`${this.constant.api}Investors/GetFile?type=` + type,
      { responseType: 'blob' })
      .pipe(
        map(
          res => {
            return {
              filename: type === 1 ? 'Inversionistas.xlsx' : 'Inversionistas.pdf',
              data: res
            };
          }
        )
      );
  }

  public fetchFileMyInvestment(type: number) {
    return this.http.get(`${this.constant.api}Capitals/ExportMyInvestment?type=` + type,
      { responseType: 'blob' })
      .pipe(
        map(
          res => {
            return {
              filename: type === 1 ? 'MisInversiones.xlsx' : 'MisInversiones.pdf',
              data: res
            };
          }
        )
      );
  }

  public delete(id: number, type: number): Observable<any> {
    return this.http.put(`${this.constant.api}Administrative/ChangeStatusUser`, {
      userid: id,
      type,
      IsDelete: true
    });
  }

  public getBanks(): Observable<any> {
    return this.http.get(`${this.constant.api}Institutions/GetList`);
  }
}
