import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Alert } from '../../../main/quick-panel/alert.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    public alerts: BehaviorSubject<Alert[]> = new BehaviorSubject([]);

    public addAlert(alert: Alert): void {
        const getAlerts = this.alerts.value;
        if (!!!getAlerts.find(a => JSON.stringify(a) === JSON.stringify(alert))) {
            getAlerts.push(alert);
        }
        this.alerts.next(getAlerts);
    }

    public removeAll(): void {
        this.alerts.next([]);
    }
}
