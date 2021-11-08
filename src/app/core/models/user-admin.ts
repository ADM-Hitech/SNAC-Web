import { Module } from './module';

export class UserAdmin {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    employeeNumber: string;
    mail: string;
    phone: string;
    enabled: boolean;
    modules: Module[];

    public fromJson(object: any) {
        var user = new UserAdmin();

        user.id = object['id'] ?? 0;
        user.firstName = object['first_name'] ?? '';
        user.lastName = object['last_name'] ?? '';
        user.password = object['password'] ?? '';
        user.employeeNumber = object['employee_number'] ?? '';
        user.mail = object['mail'] ?? '';
        user.phone = object['phone'] ?? '';
        user.enabled = object['enabled'] ?? true;
        user.modules = (object['modules'] ?? []).map((m) => Module.fromJson(m))

        return user;
    }

    public toJson() {
        return {
            id: this.id,
            first_name: this.firstName,
            last_name: this.lastName,
            password: this.password,
            employee_number: this.employeeNumber,
            mail: this.mail,
            phone: this.phone,
            enabled: this.enabled,
            modules: this.modules.map((m) => m.toJson())
        };
    }
}