import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { BehaviorSubject } from "rxjs";
import { BinariaResponseModel } from "../models/binaria-response.model";
import { Constant } from "./constant";

@Injectable()
export class BinariaService {
    public hubConnnectionIdSubcription: BehaviorSubject<string> = new BehaviorSubject<string>('');
	public responseSubcription: BehaviorSubject<BinariaResponseModel> = new BehaviorSubject<BinariaResponseModel>(null);
    private hubConnection: HubConnection;

    constructor(private contant: Constant) {
        const buildHub = new HubConnectionBuilder();
        this.hubConnection = buildHub.withUrl(this.contant.hubConnectionBinaria).configureLogging(LogLevel.Warning).build();
        this.startHub();
    }

    private startHub(): void {
		var self = this;

		console.log('hub');

		this.hubConnection.start().then((data) => {

			this.hubConnection.on('ReceiveMessageGroup', (data) => {
				self.hubConnnectionIdSubcription.next(data);
			});

			this.hubConnection.on('ReceiveMessage', (data) => {
				const toJson = JSON.parse(data);
				self.responseSubcription.next(BinariaResponseModel.fromJson(toJson));
			});
		}).catch((err) => {
			console.log('error: ', err);

			setTimeout(() => {
				this.startHub();
			}, 5000);
		});
	}
}