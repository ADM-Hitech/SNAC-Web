export class FaceRectangleModel {
    width: number;
    height: number;
    left: number;
    top: number;

    public static fromJson(object: any) {
        var face = new FaceRectangleModel();
        face.width = object['width'] ?? 0;
        face.height = object['height'] ?? 0;
        face.left = object['left'] ?? 0;
        face.top = object['top'] ?? 0;

        return face;
    }
}