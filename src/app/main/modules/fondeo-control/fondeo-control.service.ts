import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FondeoControlService {

  constructor(
    private http: HttpClient,
    private constant: Constant
  ) { }

  public fechData(page: number = 1, numrecod: number = 20, filter: string = ''): Observable<any> {
    return this.http.post(`${this.constant.api}Capitals/GetAnchorControl`, {
      page,
      numrecod,
      filter
    });
  }

  public fetchFile(type: number) {
    return this.http.get(`${this.constant.api}Capitals/GetFile?type=` + type,
      { responseType: 'blob' })
      .pipe(
        map(
          res => {
            return {
              filename: type === 1 ? 'ControlFondeo.xlsx' : 'ControlFondeo.pdf',
              data: res
            };
          }
        )
      );
  }

  public detailsFechFile(details: any) {
    return this.http.post(`${this.constant.api}Capitals/ExportDetailCapital`, details, { responseType: 'blob'})
      .pipe(
        map(
          res => ({
            filename: details.Type === 1 ? 'Detalle.xlsx' : 'Detalle.pdf',
            data: res
          })
        )
      );
  }

  public payCapital(capital: any) {
    return this.http.put(`${this.constant.api}CapitalDetails/SetPaymentPeriod`, capital);
  }

  public addSettings(periodic: any) {
    return this.http.put(`${this.constant.api}CapitalDetails/SetPromotionalSetting`, periodic);
  }
}
