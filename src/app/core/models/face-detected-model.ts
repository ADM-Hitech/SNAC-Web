import { FaceRectangleModel } from "./face-rectangle-model";

export class FaceDetectModal {
    faceId: string;
    meta: string;
    faceRectangle: FaceRectangleModel;
    file: File;
    URL1: string;

    public static fromJson(object: any): FaceDetectModal {
        const face = new FaceDetectModal();
        face.faceId = object['faceId'] ?? '';
        face.faceRectangle = FaceRectangleModel.fromJson(object['faceRectangle'] ?? {});
        face.URL1 = '';
        face.meta = JSON.stringify(object);

        return face;
    }
}