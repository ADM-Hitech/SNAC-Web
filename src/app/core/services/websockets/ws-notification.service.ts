import { Subject, Observable, Observer } from 'rxjs';
import { Constant } from '../constant';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class WsNotificationService {

    public notification: Subject<object>;

    constructor(private constant: Constant) {
      this.notification = this.connect(this.constant.ws);
    }

    public connect(url: string = ''): Subject<object> {

      if (!this.notification) {
        try {
          this.notification = this.connectNotifications(url);
        } catch (e) { }
      }

      return this.notification;
    }

    private connectNotifications(url: string): Subject<MessageEvent> {
        const socket = new WebSocket(url);

        const observable = Observable.create((obs: Observer<object>) => {
          socket.onmessage = obs.next.bind(obs);
          socket.onerror = obs.error.bind(obs);
          socket.onclose = obs.complete.bind(obs);

          return socket.close.bind(socket);
        });

        const observer = {
          next: (data: object) => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify(data));
            }
          }
        };

        return Subject.create(observer, observable);
    }
}
