import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
    selector: 'app-complete-upload-file',
    templateUrl: './comple-upload-files.component.html',
    styleUrls: ['./comple-upload-files.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CompleteUploadFilesComponent {

    constructor(
        public dialogRef: MatDialogRef<CompleteUploadFilesComponent>
    ) {
        this.dialogRef.disableClose = true;
    }
}