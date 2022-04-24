import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Constant } from "./constant";

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  constructor(
    private http: HttpClient,
    private constant: Constant
  ){}

  public getGeoPosition(address: string): Observable<any> {
    return this.http.get(`${this.constant.apiGoogle}&address=${address}`);
  }
}