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

    public static fromJson(object: any): AccountStatusModel {
        const accountStatus: AccountStatusModel = new AccountStatusModel();

        accountStatus.keyAccount = object['cuentaClabe'] ?? '';
        accountStatus.address = object['direccion'] ?? '';
        accountStatus.name = object['nombre'] ?? '';
        accountStatus.periodo = object['periodo'] ?? '';
        accountStatus.rfc = object['rfc'] ?? '';
        accountStatus.nameBank = object['abreviatura'] ?? '';
        accountStatus.businesNameBank = object['institucion'] ?? '';
        accountStatus.numberAccount = object['nocuenta'] ?? '';
        accountStatus.meta = JSON.stringify(object);

        return accountStatus;
    }
}