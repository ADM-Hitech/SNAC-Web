export class Address {
    calle: string;
    colonia: string;
    municipio: string;
    zipCode: string;
    estado: string;

    constructor() {
        this.calle = '';
        this.colonia = '';
        this.municipio = '';
        this.zipCode = '';
        this.estado = '';
    }

    public static fromGoogleService(object: any): Address {

        const address = new Address();

        if (object.status == 'OK') {
            const result = object.results[0];
            const addressRs = result.address_components;
            const calleRs = addressRs.filter((item) => item.types.includes('route'));
            const numberRs = addressRs.filter((item) => item.types.includes('street_number'));
            const coloniaRs = addressRs.filter((item) => item.types.includes('sublocality'));
            const municipioRs = addressRs.filter((item) => item.types.includes('locality'));
            const estadoRs = addressRs.filter((item) => item.types.includes('administrative_area_level_1'));
            const zipCodeRs = addressRs.filter((item) => item.types.includes('postal_code'));

            address.calle = `${calleRs.length > 0 ? calleRs[0].long_name : ''} ${numberRs.length > 0 ? numberRs[0].long_name : ''}`;
            address.colonia = `${coloniaRs.length > 0 ? coloniaRs[0].long_name : ''}`;
            address.municipio = `${municipioRs.length > 0 ? municipioRs[0].long_name : ''}`;
            address.estado = `${estadoRs.length > 0 ? estadoRs[0].long_name : ''}`;
            address.zipCode = zipCodeRs.length > 0 ? zipCodeRs[0].long_name : '';
        }

        return address;
    }
}