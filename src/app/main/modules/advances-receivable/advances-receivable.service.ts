import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdvancesReceivableService {

  constructor(
    private http: HttpClient,
    private constant: Constant
  ) { }

  public fetchData(filter: string = '', licenseid: number = 0): Observable<any> {
    let filters = '';

    if (licenseid > 0) {
      filters += `?LicenseId=${licenseid}`;
    }

    if (filter !== '') {
      if (filters.includes('?')) {
        filters += `&Filter=${filter}`;
      } else {
        filters += `?Filter=${filter}`;
      }
    }

    return this.http.get(`${this.constant.api}Accrediteds/ListAdvancesReceivable${filters}`);
  }

  public fetchFile(type: number) {
    return this.http.get(`${this.constant.api}Accrediteds/GetFileAdvances?type=` + type,
      { responseType: 'blob' })
      .pipe(
        map(
          res => {
            return {
              filename: type === 1 ? 'AdelantosCobrar.xlsx' : 'AdelantosCobrar.pdf',
              data: res
            };
          }
        )
      );
  }

  public addSettings(advance: any) {
    return this.http.put(`${this.constant.api}Advances/CalculatePromotional`, advance);
  }

  public activeOrCancelService(companyId: number, isBlocked: boolean): Observable<any> {
    return this.http.put(`${this.constant.api}Accrediteds/BlockedService`, {
      Company_Id: companyId,
      Is_Blocked: isBlocked
    });
  }
}
