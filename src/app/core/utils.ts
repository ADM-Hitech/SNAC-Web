import * as moment from "moment";

export class Utils {
    public static formatDate(date: string | Date): string {
        return moment(date).format('dd/MM/yyyy');
    }
}