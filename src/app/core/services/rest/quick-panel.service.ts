import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuickPanelService {

    constructor(
        private http: HttpClient,
        private constant: Constant
    ) {}

    public getNotification(): Observable<any> {
        return this.http.get(`${this.constant.api}Notifications`);
    }

    public deleteNotification(listId: Array<any>): Observable<any> {
        return this.http.put(`${this.constant.api}Notifications/DisableNotification`, {
            NotificationIds: listId
        });
    }
}
