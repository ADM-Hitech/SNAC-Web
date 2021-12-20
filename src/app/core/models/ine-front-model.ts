import { IneModel } from "./ine-model";

export class IneFrontModel extends IneModel {
    name: string;
    lastName: string;
    curp: string;
    birthDate: string;
    address: string;

    public static fromJson(object: any): IneFrontModel {
        const ine = new IneFrontModel();
        ine.name = object['Nombre'] ?? '';
        ine.lastName = object['Apellidos'] ?? '';
        ine.curp = object['CURP'] ?? '';
        ine.claveElector = object['ClaveElector'] ?? '';
        ine.birthDate = object['FechaDeNacimiento'] ?? '';
        ine.address = object['Direccion'] ?? '';
        ine.meta = JSON.stringify(object);
        
        return ine;
    }
}