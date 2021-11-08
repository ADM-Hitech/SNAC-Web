import { Component, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../login.service";

@Component({
    selector: 'app-employee-not-found',
    templateUrl: './employee-not-found.component.html',
    styleUrls: ['./employee-not-found.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmployeeNotFoundComponent {

    public verifyForm: FormGroup;
    public loading: boolean = false;

    constructor(
        private rest: LoginService,
        private formBuil: FormBuilder
    ) {
        this.verifyForm = this.formBuil.group({
            number: ['', Validators.required]
        });
    }
}