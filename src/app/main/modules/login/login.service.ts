import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/core/services/constant';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/core/components/navigation/navigation.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';
import { AppNavigationModel } from 'src/app/core/models/navigation.model';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { Utils } from 'src/app/core/utils';
import { MatDialog } from '@angular/material';
import { VerifyIneComponent } from 'src/app/core/components/verify-ine/verify-ine.component';
import { RequestAdvanceService } from '../request-advance/request-advance.service';
import { UploadPayrollReceiptComponent } from 'src/app/core/components/upload-payroll-receipt/upload-payroll-receipt.component';
import { VerifySelfieComponent } from 'src/app/core/components/verify-selfie/verify-selfie.component';
import { VerifyAccountStatusComponent } from 'src/app/core/components/verify-account-status/verify-account-status.component';
import { IneModel } from 'src/app/core/models/ine-model';
import { IneFrontModel } from 'src/app/core/models/ine-front-model';
import { FaceDetectModal } from 'src/app/core/models/face-detected-model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public prevCurp: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public prevError: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public previewPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private constant: Constant,
    private router: Router,
    private appNavigationService: NavigationService,
    private cookieService: CookieService
  ) { }

  public login(user: any, remember: boolean): Observable<{ 
    success: boolean,
    type: number,
    firstLogin: boolean,
    token?: string
  }> {
    this.cookieService.delete('auid');

    return this.http.post(`${this.constant.api}Login`, user).pipe(
      map((response: any) => {
        let id = 0;
        let firstLogin = true;

        if (!!!response) {
          return { success: false, type: 0, firstLogin: false };
        }

        if (!response.success) {

          if ((response?.message as string).includes('registro') || (response?.message as string).includes('siendo aprobados')) {
            throw new Error(response?.message);
          }

          return { success: false, type: 0, firstLogin: false };
        }

        firstLogin = response?.data?.user?.first_Login;

        if (!!response.data.token) {

          if (remember) {
            const emaiEncript = CryptoJS.AES.encrypt(user.mail, 'pqekey');
            this.cookieService.set('auid', emaiEncript);
          }

          const jwt = jwtDecode(response.data.token);

          id = response.data.user.id;

          this.appNavigationService.setNavigationModel(new AppNavigationModel(response.data.typeName, response.data?.user?.modules));

          localStorage.setItem('rfc', response.data.user.rfc);
          localStorage.setItem('curp', response.data.user.curp);
          
          if (!firstLogin) {
            localStorage.setItem('token', response.data.token);
          }

          localStorage.setItem('explogin', jwt.exp);
          localStorage.setItem('completeName', `${response.data.user.first_Name} ${response.data.user.last_Name}`);
        }

        return { success: true, type: response.data.type, firstLogin,	token: response.data.token};
      })
    );
  }

  public verifyEmployeeNumber(number: string): Observable<any> {
    this.prevCurp.next(number);

    return this.http.post(`${this.constant.api}Login/VerifyEmployeeNumber`, {
      EmployeeNumber: number,
      LicenceName: ''
    });
  }

  public requestRegister(object: any): Observable<any> {
    return this.http.post(`${this.constant.api}Register`, object);
  }

  public getCompanies(): Observable<any> {
    return this.http.get(`${this.constant.api}Companies/GetList`);
  }

  public recoveryPassword(mail: any) {
    return this.http.put(`${this.constant.api}Administrative/RecoveryPassword`, mail);
  }

  public changePassword(password: any) {
    return this.http.put(`${this.constant.api}Administrative/ChangePassword`, password);
  }

  public emailNotFound(object: any): Observable<any> {
    return this.http.post(`${this.constant.api}Register/EmailNotFound`, object);
  }

  public uploadSelfie(base64file: string): Observable<any> {
    return this.http.post(`${this.constant.apiBinaria}face/api/FaceId/FaceDetect`, {
      imageID: base64file
    }, {
      headers: {
        'Ocp-Apim-Subscription-Key': this.constant.tokenBinariaFace,
        'content-type': 'application/json'
      }
    });
  }

  public uploadIne(base64file: string, type: 'front' | 'back'): Observable<any> {
    let url = 'ocr/api/OCROnline/OCRINE';

    if (type === 'back') {
      url = 'ocr/api/OCROnline/OCRINEBack';
    }

    return this.http.post(`${this.constant.apiBinaria}${url}`, {
      imageID: base64file
    }, {
      headers: {
        'Ocp-Apim-Subscription-Key': this.constant.tokenBinariaOCR,
        'content-type': 'application/json'
      }
    });
  }

  public uploadStatusAccount(base64file: string, institution: string): Observable<any> {
    const url = Utils.getUrlStatusAccountBinaria(institution);
    const tokenBinaria = Utils.getTokenStatusAccountBinaria(institution);

    return this.http.post(`${this.constant.apiBinaria}${url}`, {
      imageID: base64file
    }, {
      headers: {
        'Ocp-Apim-Subscription-Key': tokenBinaria,
        'content-type': 'application/json'
      }
    });
  }

  public acceptConvenioAndCartaDeAuthorizacion(token: string): Observable<any> {
    return this.http.post(`${this.constant.api}Users/AcceptConvenioAndAutorizacion`, {
      token
    });
  }

  public updateEmail(form: string): Observable<any> {
    return this.http.put(`${this.constant.api}Login/UpdateEmail`, form);
  }

  public getInstitutions(): Observable<any> {
    return this.http.get(`${this.constant.api}Institutions/GetList?onlyActive=true`);
  }

  public async processRejectFile(
    err: any,
    advanceReq: RequestAdvanceService,
    showAlert: any,
    matDialog: MatDialog,
    curp: string
  ): Promise<void> {
    if (err.status == 400 && err.error.rejectedFile) {

      if (err.error.rejectedIne) {
          showAlert('INE Rechazada', err.error.ineMessage, 'warning');

          const sleep = new Promise((res) => setTimeout(() => res(true), 1000));
          await sleep;

          const ineDialog = matDialog.open(VerifyIneComponent, {
              data: {
                  service: this,
                  curp: curp
              },
              panelClass: 'm-verify-ine'
          });

          const responseIneDialog = await ineDialog.afterClosed().toPromise() as Array<IneModel>;
          await advanceReq.syncIneAccredited(responseIneDialog[0] as IneFrontModel, responseIneDialog[1], err.error.id).toPromise();

          showAlert('Exitoso', 'Su Ine fue enviada nuevamente', 'success');

          await new Promise((res) => setTimeout(() => res(true), 600));
      }

      if (err.error.rejectedPaysheet) {
          showAlert('Recibo de Nomina Rechazada', err.error.paysheetMessage, 'warning');

          const sleep = new Promise((res) => setTimeout(() => res(true), 1000));
          await sleep;

          const payRollReceipt = matDialog.open(UploadPayrollReceiptComponent, {
              data: {
                  service: advanceReq,
                  rfc: err.error.rfc,
                  onlyOne: true
              }
          });

          const responsePayRoll = await payRollReceipt.afterClosed().toPromise();
          await advanceReq.syncPaysheet(responsePayRoll, err.error.id).toPromise();

          showAlert('Exitoso', 'Su Recibo de nomina fue enviada nuevamente', 'success');

          await new Promise((res) => setTimeout(() => res(true), 600));
      }

      if (err.error.rejectedSelfie) {
          showAlert('Selfie Rechazada', err.error.selfieMessage, 'warning');

          const sleep = new Promise((res) => setTimeout(() => res(true), 1000));
          await sleep;

          const slefieDialog = matDialog.open(VerifySelfieComponent, {
            data: {
              service: this
            },
            panelClass: 'm-verify-selfie'
          });

          const responseSelfie = await slefieDialog.afterClosed().toPromise();
          const selfie = new FaceDetectModal();
          selfie.URL1 = responseSelfie.URL1;
          await advanceReq.syncSelfie(selfie, err.error.id);

          showAlert('Exitoso', 'Su Selfie fue enviada nuevamente', 'success');

          await new Promise((res) => setTimeout(() => res(true), 600));
      }

      if (err.error.rejectedStatusAccount) {
          showAlert('Estado de Cuenta Rechazada', err.error.statusAccountMessage, 'warning');

          const sleep = new Promise((res) => setTimeout(() => res(true), 1000));
          await sleep;

          const statusAccount = matDialog.open(VerifyAccountStatusComponent, {
              data: {
                  service: this,
                  rfc: err.error.rfc ?? curp,
                  names: '',
                  lastName: ''
              },
              panelClass: 'm-verify-account-status'
          });

          const responseStatusAccount = await statusAccount.afterClosed().toPromise();
          await advanceReq.syncStatusAccount(responseStatusAccount, err.error.id);

          showAlert('Exitoso', 'Su estado de cuenta fue enviado nuevamente', 'success');

          await new Promise((res) => setTimeout(() => res(true), 600));
      }

      return;
    }
  }

  public logAuth(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
