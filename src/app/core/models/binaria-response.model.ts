export class BinariaResponseModel {
    public IsIdentical: boolean;
    public Confidence: number;
    public URL1: string;
    public URL2: string;

    public static fromJson(object: any) : BinariaResponseModel {
        const binariaResponse = new BinariaResponseModel();
        binariaResponse.IsIdentical = object['IsIdentical'] ?? false;
        binariaResponse.Confidence = object['Confidence'] ?? 0;
        binariaResponse.URL1 = object['URL1'] ?? '';
        binariaResponse.URL2 = object['URL2'] ?? '';

        return binariaResponse;
    }
}