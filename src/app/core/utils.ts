import * as moment from "moment";
import { environment } from "src/environments/environment";

export class Utils {
    public static formatDate(date: string | Date): string {
        return moment(date).format('DD/MM/yyyy');
    }

    public static typeFile(type: string): boolean {
        return ['jpg', 'jpeg', 'png', 'pdf'].some((format) => type.toLocaleLowerCase().includes(format));
    }

    public static getAllNumbers(cadena: string): Array<string> {
        return Array.from((cadena as any).matchAll(/\d+/g), m => m[0]);
    }

    public static getAllText(cadena: string): Array<string> {
        return Array.from((cadena as any).matchAll(/[\w]+/g), m => m[0]);
    }

    public static getFormatDates(cadena: string): Array<string> {
        return Array.from((cadena as any).matchAll(/(\d+((\/|-)\d+|(\/|-)\w+)(\/|-)\d+)/g), m => m[0]);
    }

    public static getZipCode(cadena: string): string | null {
        const result = cadena.match(/\d{5}/g);
        
        return result.length > 0 ? result[0] : null;
    }

    public static clearTextsOnlyMonth(list: Array<string>): Array<string> {
        return list.filter((item) => Utils.getMonthNumber(item) > 0);
    } 

    public static getMonthNumber(cadena: string): number {
        const months = [
            ['enero', 'ene', '01', '1'],
            ['febrero', 'feb', '02', '2'],
            ['marzo', 'mar', '03', '3'],
            ['abril', 'abr', '04', '4'],
            ['mayo', 'may', '05', '5'],
            ['junio', 'jun', '06', '6'],
            ['julio', 'jul', '07', '7'],
            ['agosto', 'ago', '08', '8'],
            ['septiembre', 'set', 'sep', '09', '9'],
            ['octubre', 'oct', '10'],
            ['noviembre', 'nov', '11'],
            ['diciembre', 'dic', '12']
        ];

        const index = months.findIndex((val: Array<string>) => val.includes(cadena.toLocaleLowerCase()));

        return index + 1;
    }

    public static completeYear(year: string | number): string {
        return year.toString().padStart(4, '20');
    }

    public static completeMonthDay(month: string | number): string {
        return month.toString().padStart(2, '0');
    }

    public static getDates(cadena: string): Array<any> {
        const allText = Utils.getAllText(cadena);
        const formatDates = Utils.getFormatDates(cadena);
        const onlyMonths = Utils.clearTextsOnlyMonth(allText);
        const allNumbers = Utils.getAllNumbers(cadena);


        if (formatDates.length == 2) {
            let date1 = '';
            let date2 = '';
            let splitDate1 = [];
            let splitDate2 = [];

            if (formatDates[0].includes('/')) {
                splitDate1 = formatDates[0].split('/');
            } else {
                splitDate1 = formatDates[0].split('-');
            }

            if (formatDates[1].includes('/')) {
                splitDate2 = formatDates[1].split('/');
            } else {
                splitDate2 = formatDates[1].split('-');
            }

            const numberMonth1 = Utils.getMonthNumber(splitDate1[1]);
            date1 = `${Utils.completeYear(splitDate1[2])}/${Utils.completeMonthDay(numberMonth1)}/${Utils.completeMonthDay(splitDate1[0])}`;

            const numberMonth2 = Utils.getMonthNumber(splitDate2[1]);
            date2 = `${Utils.completeYear(splitDate2[2])}/${Utils.completeMonthDay(numberMonth2)}/${Utils.completeMonthDay(splitDate2[0])}`;

            return [moment(date1), moment(date2)];
        }

        if (allNumbers.length == 4) {
            let date1 = '';
            let date2 = '';
            const numberMonth1 = Utils.completeMonthDay(Utils.getMonthNumber(onlyMonths[0]));
            const numberMonth2 = Utils.completeMonthDay(Utils.getMonthNumber(onlyMonths[1]));

            date1 = `${Utils.completeYear(allNumbers[1])}/${numberMonth1}/${Utils.completeMonthDay(allNumbers[0])}`;
            date2 = `${Utils.completeYear(allNumbers[3])}/${numberMonth2}/${Utils.completeMonthDay(allNumbers[2])}`;

            return [moment(date1), moment(date2)];
        }

        if (allNumbers.length == 2) {
            const filtermonths = onlyMonths.filter((item) => item.length >= 3);
            const date = new Date();
            let year = date.getFullYear();
            const month1 = Utils.completeMonthDay(Utils.getMonthNumber(filtermonths[0]));
            const month2 = Utils.completeMonthDay(Utils.getMonthNumber(filtermonths[1]));

            if (Utils.getMonthNumber(filtermonths[1]) > (date.getMonth() + 1)) {
                year--;
            }

            const date1 = `${year}/${month1}/${Utils.completeMonthDay(allNumbers[0])}`;
            const date2 = `${year}/${month2}/${Utils.completeMonthDay(allNumbers[1])}`;

            return [moment(date1), moment(date2)];
        }

        return [];
    }

    public static getUrlStatusAccountBinaria(institution: string): string {
        let url;
        
        switch(institution) {
            case 'STP': 
            case 'ALBO':
                url = 'edc/api/OCROnline/OCREdoCuentaAlbo';
            break;
            case 'BANAMEX':
                url = 'edc/api/OCROnline/OCREdoCuentaBanamex';
            break;
            case 'AZTECA':
                url = 'edc/api/OCROnline/OCREdoCuentaAzteca';
            break;
            case 'BBVA BANCOMER':
                url = 'edc/api/OCROnline/OCREdoCuentaBBVA';
            break;
            case 'HSBC':
                url = 'edc/api/OCROnline/OCREdoCuentaHSBC';
            break;
            case 'SANTANDER':
                url = 'edc/api/OCROnline/OCREdoCuentaSantander';
            break;
            case 'SCOTIABANK':
                url = 'edc/api/OCROnline/OCREdoCuentaScotiabank';
            break;
            default:
                url = 'ocr/api/OCROnline/OCREdoCuentaBancos';
            break;
        }

        return url;
    }

    public static getTokenStatusAccountBinaria(instution: string): string {
        let token = environment.tokenBinariaOCR;

        switch(instution) {
            case 'STP':
            case 'ALBO':
            case 'BANAMEX':
            case 'AZTECA':
            case 'BBVA BANCOMER':
            case 'HSBC':
            case 'SANTANDER':
            case 'SCOTIABANK':
                token = environment.tokenBinariaBancos;
            break;
        }

        return token;
    }

    public static dataURLtoBlob(dataUrl: string): Blob {
        let array, binary, i , len;
		binary = atob(dataUrl.split(',')[1]);
		array = [];
		i = 0;
		len = binary.length;

		while(i<len) {
			array.push(binary.charCodeAt(i));
			i++;
		}

		return new Blob([new Uint8Array(array)], {
			type: 'image/jpg'
		});
    }
}