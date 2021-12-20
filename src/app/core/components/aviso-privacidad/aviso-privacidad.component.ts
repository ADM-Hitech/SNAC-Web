import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
    selector: 'app-aviso-privacidad',
    templateUrl: './aviso-privacidad.component.html',
    styleUrls: ['./aviso-privacidad.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AvisoPrivacidadComponent {

    constructor(
        private readonly dialogRef: MatDialogRef<AvisoPrivacidadComponent>
    ) {
        this.dialogRef.disableClose = true;
    }

    public accept(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }
}