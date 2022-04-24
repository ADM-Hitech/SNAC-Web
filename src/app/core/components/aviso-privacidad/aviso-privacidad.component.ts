import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-aviso-privacidad',
    templateUrl: './aviso-privacidad.component.html',
    styleUrls: ['./aviso-privacidad.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AvisoPrivacidadComponent {

    constructor(
        private readonly dialogRef: MatDialogRef<AvisoPrivacidadComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            hiddeButtons: boolean
        },
    ) {
        if (!this.data?.hiddeButtons) {
            this.dialogRef.disableClose = true;
        }
    }

    public accept(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }

    public get HiddeButtons(): boolean {
        return this.data?.hiddeButtons;
    }
}