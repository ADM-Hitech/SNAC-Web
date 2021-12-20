import * as moment from 'moment';

export class PaySheetModel {
    uuid: string;
    name: string;
    rfc: string;
    curp: string;
    nss: string;
    dateInitial: Date;
    dateFinish: Date;
    neto: number;
    total: number;
    file: File;
    meta: string;

    /**
     * fromJson
     */
     public static fromJson(object: any) {
        var paysheet = new PaySheetModel();
        paysheet.name = object['nombre'] ?? '';
        paysheet.rfc = object['rfc'] ?? '';
        paysheet.curp = object['curp'] ?? '';
        paysheet.nss = object['nss'] ?? '';
        paysheet.dateInitial = moment(object['fechainicio'] ?? '', 'DD/MM/YYYY').toDate();
        paysheet.dateFinish = moment(object['fechafin'] ?? '', 'DD/MM/YYYY').toDate();
        paysheet.neto = parseFloat((object['netonomina'] ?? '0').replace(',', '').replace('$', '')) ?? 0;
        paysheet.total = parseFloat((object['netopagar'] ?? '0').replace(',', '').replace('$', '')) ?? 0;
        paysheet.meta = JSON.stringify(object);

        return paysheet;
    }

    public toJson = () => ({
        'UUID': this.uuid,
        'Name': this.name,
        'Rfc': this.rfc,
        'Curp': this.curp,
        'Nss': this.nss,
        'DateInitial': moment(this.dateInitial).format('YYYY-MM-DD'),
        'DateFinish': moment(this.dateFinish).format('YYYY-MM-DD'),
        'Neto': this.neto.toString(),
        'Total': this.total.toString(),
        'Meta': this.meta
    });
}