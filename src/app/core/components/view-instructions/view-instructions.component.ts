import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
    selector: 'app-view-instructions',
    templateUrl: './view-instructions.component.html',
    styleUrls: ['./view-instructions.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ViewInstructionsComponent {

    constructor(
        private readonly sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) private data: {
			isQuestion: boolean
        },
    ) {}

    public get urlInstruction(): SafeUrl {
        var url = `${window.location.origin}/assets/SNAC_INSTRUCCIONES.pdf`;

        if (this.data?.isQuestion) {
            var url = `${window.location.origin}/assets/SNAC_PREGUNTAS.pdf`;
        }

        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}