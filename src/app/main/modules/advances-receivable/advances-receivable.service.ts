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

  public fetchData(filter: string = ''): Observable<any> {
    return this.http.get(`${this.constant.api}Accrediteds/ListAdvancesReceivable?filter=` + filter);
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
