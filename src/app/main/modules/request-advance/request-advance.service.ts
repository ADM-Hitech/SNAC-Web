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

        return this.http.get(`${this.constant.api}Advances/GetByAccredited/${userId}`);
    }

    public calculateAdvance(paysheet: Array<PaySheetModel>): Observable<number> {
        const formData = new FormData();
        formData.append('amount', '0');
        formData.append('PaySheetsJson', JSON.stringify(paysheet.map(item => item.toJson())));

        paysheet.forEach((element) => {
            formData.append(element.uuid, element.file);
        });

        return this.http.post<Object>(`${this.constant.api}Advances/CalculateAdvance`, formData).pipe(
            map((response: any) => {
                return response.data?.advance?.maximum_Amount || 0;
            })
        );
    }

    public preAdvance(paysheet: Array<PaySheetModel>, amount?: number): Observable<any> {
        const formData = new FormData();
        formData.append('amount', amount.toString());
        formData.append('PaySheetsJson', JSON.stringify(paysheet.map(item => item.toJson())));

        paysheet.forEach((element) => {
            formData.append(element.uuid, element.file);
        });

        return this.http.post<Object>(`${this.constant.api}Advances/CalculateAdvance`, formData);
    }

    public getInfoBank(): Observable<any> {
        return this.http.get(`${this.constant.api}Users/GetUser`);
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

    public syncIneAccredited(front: IneFrontModel, back: IneModel, id: number): Observable<any> {
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
        formData.append('AccreditedId', id.toString());
        formData.append('File', front.file);
        formData.append('FileBack', back.file);
        formData.append('Calle', front.addressDetail.calle);
        formData.append('Colonia', front.addressDetail.colonia);
        formData.append('Municipio', front.addressDetail.municipio);
        formData.append('ZipCode', front.addressDetail.zipCode);
        formData.append('Estado', front.addressDetail.estado);

        return this.http.post(`${this.constant.api}BinariaFiles/IneAccount`, formData);
    }

    public syncStatusAccount(statusAccount: AccountStatusModel, id: number): Observable<any> {
        const formData = new FormData();
        formData.append('KeyAccount', statusAccount.keyAccount);
        formData.append('Address', statusAccount.address);
        formData.append('Name', statusAccount.name);
        formData.append('Periodo', statusAccount.periodo);
        formData.append('Rfc', statusAccount.rfc);
        formData.append('NameBank', statusAccount.nameBank);
        formData.append('BusinessNameBank', statusAccount.businesNameBank);
        formData.append('NumberAccount', statusAccount.numberAccount);
        formData.append('AccreditedId', id.toString());
        formData.append('InstitutionId', statusAccount.institutionId.toString());
        formData.append('Meta', statusAccount.meta);
        formData.append('File', statusAccount.file);

        return this.http.post(`${this.constant.api}BinariaFiles/StatusAccount`, formData);
    }

    public syncPaysheet(paysheet: Array<PaySheetModel>, id: number): Observable<any> {

        const formData = new FormData();
        formData.append('AccreditedId', id.toString());
        formData.append('PaySheetsJson', JSON.stringify(paysheet.map(item => item.toJson())));
        
        paysheet.forEach((item) => {
            formData.append(item.uuid, item.file);
        });

        return this.http.post(`${this.constant.api}BinariaFiles/Paysheet`, formData);
    }

    public requestAdvance(amount: number, paysheet: Array<PaySheetModel>): Observable<any> {
        const formData = new FormData();
        formData.append('amount', amount.toString());
        formData.append('PaySheetsJson', JSON.stringify(paysheet.map(item => item.toJson())));

        paysheet.forEach((element) => {
            formData.append(element.uuid, element.file);
        });

        return this.http.post(`${this.constant.api}Advances`, formData);
    }

    public syncSelfie(selfie: FaceDetectModal, id: number): Observable<any> {
        const formData = new FormData();
        formData.append('AccreditedId', id.toString());
        formData.append('URL1', selfie.URL1);

        return this.http.post(`${this.constant.api}BinariaFiles/Selfie`, formData);
    }

    public completeUploadFiles(id: number): Observable<any> {
        return this.http.put(`${this.constant.api}BinariaFiles/CompleteUploadFiles`, {
            id
        });
    }
}