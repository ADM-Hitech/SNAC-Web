import { User } from './user.model';

export class UserLogin {
    company: any;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    bnf: number;
    prv: string;
    rol: {
        code: string;
        id: number;
        name: string;
    };
    sub: number;
    user: User;

    constructor() {
        this.company = null;
        this.exp = 0;
        this.iat = 0;
        this.iss = '';
        this.jti = '';
        this.bnf = 0;
        this.prv = '';
        this.rol = {
            code: '',
            id: 0,
            name: ''
        };
        this.sub = 0;
        this.user = null;
    }
}
