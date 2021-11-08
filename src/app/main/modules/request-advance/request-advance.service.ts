import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AccountStatusModel } from "src/app/core/models/account-status.model";
import { FaceDetectModal } from "src/app/core/models/face-detected-model";
import { IneFrontModel } from "src/app/core/models/ine-front-model";
import { IneModel } from "src/app/core/models/ine-model";
import { PaySheetModel } from "src/app/core/models/pay-sheet.model";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Constant } from "src/app/core/services/constant";

@Injectable({
    providedIn: 'root'
})
export class RequestAdvanceService {

    constructor(
        private http: HttpClient,
        private constant: Constant,
        private auth: AuthService
    ) {}

    public getMyAdvances(): Observable<any> {
        const userId = this.auth.id;

        return this.http.get(`${this.constant.api}/Advances/GetByAccredited/${userId}`);
    }

    public calculateAdvance(): Observable<number> {
        return this.http.post<Object>(`${this.constant.api}/Advances/CalculateAdvance`, {}).pipe(
            map((response: any) => {
                return response.data?.advance?.maximum_Amount || 0;
            })
        );
    }

    public preAdvance(amount?: number): Observable<any> {
        return this.http.post<Object>(`${this.constant.api}/Advances/CalculateAdvance`, { amount });
    }

    public getInfoBank(): Observable<any> {
        return this.http.get(`${this.constant.api}/Users/GetUser`);
    }

    public uploadPaySheet(base64file: string): Observable<any> {
        return this.http.post(`${this.constant.apiBinaria}ocr/api/OCROnline/OCRNomina`, {
            imageID: base64file
        }, {
            headers: {
                'Ocp-Apim-Subscription-Key': this.constant.tokenBinariaOCR,
                'content-type': 'application/json'
            }
        });
    }

    public syncIneAccredited(front: IneFrontModel, back: IneModel): Observable<any> {
        const dateBirth = moment(front.birthDate);
        const formData = new FormData();
        formData.append('Name', front.name);
        formData.append('LastName', front.lastName);
        formData.append('Curp', front.curp);
        formData.append('BirthDate', dateBirth.isValid ? dateBirth.format('yyyy/MM/dd') : '1800/01/01');
        formData.append('Address', front.address);
        formData.append('ClaveElector', front.claveElector);
        formData.append('ClaveElectorBack', back.claveElector);
        formData.append('Meta', front.meta);
        //formData.append('AccreditedId', front.meta);
        formData.append('File', front.file);
        formData.append('FileBack', back.file);

        return this.http.post(`${this.constant.api}BinariaFiles/IneAccount`, formData);
    }

    public syncStatusAccount(statusAccount: AccountStatusModel): Observable<any> {
        const formData = new FormData();
        formData.append('KeyAccount', statusAccount.keyAccount);
        formData.append('Address', statusAccount.address);
        formData.append('Name', statusAccount.name);
        formData.append('Periodo', statusAccount.periodo);
        formData.append('Rfc', statusAccount.rfc);
        formData.append('NameBank', statusAccount.nameBank);
        formData.append('BusinessNameBank', statusAccount.businesNameBank);
        formData.append('NumberAccount', statusAccount.numberAccount);
        //formData.append('AccreditedId', pref.me().userId.toString());
        formData.append('Meta', statusAccount.meta);
        formData.append('File', statusAccount.file);

        return this.http.post(`${this.constant.api}BinariaFiles/StatusAccount`, formData);
    }

    public syncPaysheet(paysheet: Array<PaySheetModel>): Observable<any> {

        const formData = new FormData();
        formData.append('PaySheetsJson', JSON.stringify(paysheet.map(item => item.toJson())));
        
        paysheet.forEach((item) => {
            formData.append(item.uuid, item.file);
        });

        return this.http.post(`${this.constant.api}BinariaFiles/Paysheet`, formData);
    }

    public syncSelfie(selfie: FaceDetectModal): Observable<any> {
        const formData = new FormData();
        // formData.append('AccreditedId', pref.me().userId.toString());
        formData.append('metadata', selfie.meta);
        formData.append('FaceId', selfie.faceId);
        formData.append('File', selfie.file);

        return this.http.post(`${this.constant.api}BinariaFiles/Selfie`, formData);
    }
}