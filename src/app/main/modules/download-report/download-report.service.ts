import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Constant } from "src/app/core/services/constant";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class DownloadReportService {

    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public downloadReport(form: any): Observable<any> {
        return this.http.post(`${this.constant.api}Administrative/DownloadReports`,
            form,
            { responseType: 'blob' }
        ).pipe(
            map(
                res => ({
                    filename: `Cartas_Mandato-${form.NumberWeek}.zip`,
                    data: res
                })
            )
        );
    }
}