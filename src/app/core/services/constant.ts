import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class Constant {
    get api() {
        return environment.api;
    }

    get apiBinaria() {
        return environment.apiBinaria;
    }

    get tokenBinariaOCR() {
        return environment.tokenBinariaOCR;
    }

    get tokenBinariaFace() {
        return environment.tokenBinariaFace;
    }

    get ws() {
        return environment.ws;
    }

    get hubConnectionBinaria() {
        return environment.hubConnectionBinaria;
    }
}
