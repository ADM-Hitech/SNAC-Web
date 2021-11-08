import { User } from './user.model';

export class AuthToken {
    token: string;
    type: number;
    typeName: string;
    user: any;


    /**
     * fromJson
     */
    public fromJson(object: any) {
        var authToken = new AuthToken();
        authToken.token = object['token'] ?? '';
        authToken.user = User.fromJson(object['user'] ?? {});
        authToken.type = object['type'] ?? '';
        authToken.typeName = object['TypeName'] ?? '';
    }
}