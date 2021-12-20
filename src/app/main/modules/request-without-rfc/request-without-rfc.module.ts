import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/core/modules/shared.module";
import { RequestWithoutRfcComponent } from "./request-without-rfc.component";
import { RequestWithoutRfcRouting } from "./request-without-rfc.routing";
import { RequestWithoutRfcService } from "./request-without-rfc.service";

@NgModule({
    declarations: [
        RequestWithoutRfcComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RequestWithoutRfcRouting
    ],
    providers: [
        RequestWithoutRfcService
    ]
})
export class RequestWithoutRfcModule {}
