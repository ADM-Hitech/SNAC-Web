import * as moment from "moment";
import { Utils } from "../utils";

export class AccountStatusModel {
    keyAccount: string;
    address: string;
    name: string;
    periodo: string;
    rfc: string;
    nameBank: string;
    businesNameBank: string;
    numberAccount: string;
    meta: string;
    file: File;
    date1: moment.Moment;
    date2: moment.Moment;
    institutionId: number;

    public static fromJson(object: any): AccountStatusModel {
        const accountStatus: AccountStatusModel = new AccountStatusModel();

        accountStatus.keyAccount = (object['cuentaClabe'] ?? '').replaceAll('-', '').replaceAll(/\s/g, '');
        accountStatus.address = object['direccion'] ?? '';
        accountStatus.name = object['nombre'] ?? '';
        accountStatus.periodo = object['periodo'] ?? '';
        accountStatus.rfc = (object['rfc'] ?? '').replaceAll('-', '').replaceAll(/\s/g, '');
        accountStatus.nameBank = object['abreviatura'] ?? '';
        accountStatus.businesNameBank = object['institucion'] ?? '';
        accountStatus.numberAccount = (object['nocuenta'] ?? '').replaceAll('-', '').replaceAll(/\s/g, '');

        if (accountStatus.numberAccount == '') {
            accountStatus.numberAccount = accountStatus.keyAccount;
        }

        accountStatus.meta = JSON.stringify(object);

        const clearKeyAccount = accountStatus.keyAccount.match(/\d+/g);
        if (clearKeyAccount != null && clearKeyAccount.length > 0) {
            accountStatus.keyAccount = clearKeyAccount[0];
        }
        
        const clearNumberAccount = accountStatus.numberAccount.match(/\d+/g);
        if (clearNumberAccount != null && clearNumberAccount.length > 0) {
            accountStatus.numberAccount = clearNumberAccount[0];
        }

        const dates = Utils.getDates(accountStatus.periodo);

        if (dates.length == 2) {
            accountStatus.date1 = dates[0];
            accountStatus.date2 = dates[1];
        }

        return accountStatus;
    }
}