import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/core/modules/shared.module";
import { DownloadReportComponent } from "./download-report.component";
import { DownloadReportRouting } from "./download-report.routing";

@NgModule({
    declarations: [
        DownloadReportComponent,
    ],
    imports: [
        DownloadReportRouting,
        SharedModule,
        CommonModule
    ]
})
export class DownloadReportModule {}
