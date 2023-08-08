import { Component, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatIconRegistry } from "@angular/material";
import { ViewInstructionsComponent } from "src/app/core/components/view-instructions/view-instructions.component";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent {

    constructor(
        private readonly matDialog: MatDialog,
        private readonly matIconRegistry: MatIconRegistry,
        private readonly domSanitizer: DomSanitizer
    ) {
        this.matIconRegistry.addSvgIcon('logoWhats', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/icons/ico-whatsapp.svg'));
    }

    public dialog(): void {
        if (document.body.clientWidth > 768) {
            this.matDialog.open(ViewInstructionsComponent);
        } else {
            window.open(`${window.location.origin}/assets/SNAC_INSTRUCCIONES.pdf`, "_blank");
        }
    }

    public showQuestion(): void {
        if (document.body.clientWidth > 768) {
            this.matDialog.open(ViewInstructionsComponent, {
                data: {
                    isQuestion: true
                }
            });
        } else {
            window.open(`${window.location.origin}/assets/SNAC_PREGUNTAS.pdf`, "_blank");
        }
    }

    public openWhats(): void {
        window.open("https://api.whatsapp.com/send/?phone=525592252019&text=hola+me+gustar%C3%ADa+informaci%C3%B3n&app_absent=0", "_blank");
    }
    
}