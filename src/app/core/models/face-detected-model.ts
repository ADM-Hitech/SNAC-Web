import { FaceRectangleModel } from "./face-rectangle-model";

export class FaceDetectModal {
    faceId: string;
    meta: string;
    faceRectangle: FaceRectangleModel;
    file: File;

    public static fromJson(object: any): FaceDetectModal {
        const face = new FaceDetectModal();
        face.faceId = object['faceId'] ?? '';
        face.faceRectangle = FaceRectangleModel.fromJson(object['faceRectangle'] ?? {});
        face.meta = JSON.stringify(object);

        return face;
    }
}