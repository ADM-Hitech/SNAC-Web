import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from 'src/app/core/services/constant';

@Injectable({
    providedIn: 'root'
})
export class AccountStatusLicenseService {

    constructor(private http: HttpClient, private constant: Constant) {}

    public fetchMovement(
        page: number = 1,
        numRecord: number = 50,
        filter: string = '',
        licenseid: number = 0,
        year: number = 0,
        month: number = 0
    ): Observable<any> {
        return this.http.get(`${this.constant.api}Movement?LicenseId=${licenseid}&Page=${page}&NumRecord=${numRecord}&Filter=${filter}&Year=${year}&Month=${month}`);
    }

    public fetchLicensePriceRange(licenseid: number): Observable<any> {
        let filter = '';

        if (!!licenseid) {
            filter = `?LicenseId=${licenseid}`;
        }

        return this.http.get(`${this.constant.api}LicensePriceRange${filter}`);
    }
}
