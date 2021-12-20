import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from 'src/app/core/services/constant';

@Injectable({
    providedIn: 'root'
})
export class PendingRecordService {

    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public fetchAcrediteds(page: number = 1, numrecord: number = 20, filter: string = ''): Observable<any> {
        return this.http.post(`${this.constant.api}Accrediteds/GetExternal`, {
            page,
            numrecord,
            filter
        });
    }

    public actionDocument(notification: {
        Type: string,
        Approve: boolean,
        Message: string,
        IdDocument: number,
        AccreditedId: number
    }): Observable<any> {
        return this.http.post(`${this.constant.api}Accrediteds/NotificationDocument`, notification);
    }

    public approveDocuments(id: number): Observable<any> {
        return this.http.put(`${this.constant.api}Accrediteds/ApproveDocuments/${id}`, {});
    }
}
