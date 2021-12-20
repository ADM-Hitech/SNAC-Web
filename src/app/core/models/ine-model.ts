export class IneModel {
    claveElector: string;
    meta: string;
    file: File;

    public static fromJson(object: any): IneModel {
        const ine = new IneModel();

        ine.claveElector = object['text'] ?? '';
        ine.meta = JSON.stringify(object);

        return ine;
    }
}