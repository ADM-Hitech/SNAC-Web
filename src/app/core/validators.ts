import { AbstractControl, FormGroup } from '@angular/forms';

export function ValidNumberWithDecimal(control: AbstractControl): any {
    const valid = new RegExp(/^(\d+(\.\d+)?)$/m);

    if (!valid.exec(control.value)) {
        return { isNotNumber: true };
    }

    return null;
}

export function ValidNumber(control: AbstractControl): any {
    const valid = new RegExp(/^(\d+)?$/m);

    if (!valid.exec(control.value)) {
        return { isNotNumber: true };
    }

    return null;
}

export function ValidNumberNotRequired(control: AbstractControl): any {
    const valid = new RegExp(/^(\d+)?$/m);

    if (!!control.value) {
        if (!valid.exec(control.value)) {
            return { isNotNumber: true };
        }
    }

    return null;
}

export function ValidIsObject(control: AbstractControl): any {

    if (typeof control.value !== 'object') {
        return { noObject: true };
    }

    return null;
}

export function RequiredFileType(types: string[]): any {
    return (control: AbstractControl): any => {
        const file = control.value;

        if (file) {
            const splitname: string[] = file.name.split('.');
            const extension = splitname.pop();

            if (types.findIndex((type) => type.toLowerCase() === extension.toLowerCase()) >= 0) {
                return;
            }
        } else {
            return;
        }

        return {
            incorrectFormat: true,
            acceptedFormats: types.join(', ')
        };
    };
}

export function ValidaAddAdvisor(group: FormGroup): any {
    const inputAccountNumber = group.get('accountNumber').value;
    const inputConfirmAccountNumber = group.get('confirmAccountNumber').value;

    if (inputAccountNumber !== inputConfirmAccountNumber) {

        group.get('confirmAccountNumber').setErrors({errorAccountNumber: true});

        return {
            errorAccountNumber: true
        };
    }

    return null;
}
