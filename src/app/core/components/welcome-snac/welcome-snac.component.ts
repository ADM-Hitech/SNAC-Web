import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-welcome-snac',
    templateUrl: './welcome-snac.component.html',
    styleUrls: ['./welcome-snac.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WelcomeSnacComponent {

    constructor(
        public dialogRef: MatDialogRef<WelcomeSnacComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
    ) {
        this.dialogRef.disableClose = true;
    }
}