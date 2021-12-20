import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material";
import { VerifySelfieComponent } from "src/app/core/components/verify-selfie/verify-selfie.component";
import { LoginService } from "../login.service";
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Constant } from "src/app/core/services/constant";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent {

    public hubConnection: HubConnection;
    public connectId: string = '';

    constructor(
        private readonly matDialog: MatDialog,
        private rest: LoginService,
        private constant: Constant,
        private sanitizer: DomSanitizer
    ) {
        const builderHub = new HubConnectionBuilder();
		this.hubConnection = builderHub.withUrl(this.constant.hubConnectionBinaria).configureLogging(LogLevel.Information).build();
        this.start();
		console.log(this.hubConnection);
    }

    public dialog(): void {
        this.matDialog.open(VerifySelfieComponent, {
            data: {
                service: this.rest
            }
        })
    }

    public async start(): Promise<any> {
        try {
            await this.hubConnection.start();
            this.connectId = this.hubConnection.connectionId;
            
            this.hubConnection.on("ReceiveMessageAll",(data)=>{
                console.log("ReceiveMessageAll: "+data);
            }); 
    
            this.hubConnection.on('ReceiveMessageUser', (data) => {
                console.log(data);
            });
    
            this.hubConnection.on('ReceiveMessage', (data) => {
                console.log(data);
            });
        } catch(err) {
            console.log(err);
            setTimeout(() => {
                this.start();
            }, 5000);
        }
    }

    public get iframeUrl(): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://identityverify.azurewebsites.net/facialIdentity/id/${this.connectId}/keyws/${this.constant.tokenBinariaFace}`);
    }
    
}