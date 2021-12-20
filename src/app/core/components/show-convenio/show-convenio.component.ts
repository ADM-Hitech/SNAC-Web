import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer, SafeHtml, SafeUrl } from "@angular/platform-browser";
import { AuthService } from "../../services/auth/auth.service";
import { Constant } from "../../services/constant";

@Component({
    selector: 'app-show-convenio',
    templateUrl: './show-convenio.component.html',
    styleUrls: ['./show-convenio.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShowConvenioComponent implements OnInit {

    public htmlConvenio: SafeHtml = '';
    public loading: boolean = false;
    public loadingConvenio: boolean = false;

    constructor(
        private dialogRef: MatDialogRef<ShowConvenioComponent>,
        @Inject(MAT_DIALOG_DATA) private data: {
            token: string
        },
        private constant: Constant,
        private auth: AuthService,
        private sanitizer: DomSanitizer,
        private http: HttpClient
    ) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit(): void {
        this.getHtml();
    }

    public accept(): void {
        this.dialogRef.close(true);
    }

    public cancel(): void {
        this.dialogRef.close(false);
    }

    private getHtml(): void {

        this.loadingConvenio = true;
        const url = `${this.constant.api}Users/GetConvenio?token=${this.data.token}`;

        this.http.get(url, { responseType: 'text' }).subscribe(response => {
            this.htmlConvenio = this.sanitizer.bypassSecurityTrustHtml(response);
            this.loadingConvenio = false;
        }, err => {
            this.loadingConvenio = false;
        });
    }
}