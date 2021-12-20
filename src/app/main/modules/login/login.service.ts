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

  public uploadStatusAccount(base64file: string): Observable<any> {
    return this.http.post(`${this.constant.apiBinaria}ocr/api/OCROnline/OCREdoCuentaBancos`, {
      imageID: base64file
    }, {
      headers: {
        'Ocp-Apim-Subscription-Key': this.constant.tokenBinariaOCR,
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

  public logAuth(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
