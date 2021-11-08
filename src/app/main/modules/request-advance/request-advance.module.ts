import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/core/modules/shared.module";
import { RequestAdvanceComponent } from "./request-advance.component";
import { RequestAdvanceRouting } from "./request-advance.routing";
import { RequestAdvanceService } from "./request-advance.service";
import { TableAdvanceComponent } from "./table-advances/table-advance.component";

@NgModule({
    declarations: [
        RequestAdvanceComponent,
        TableAdvanceComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RequestAdvanceRouting
    ],
    providers: [
        RequestAdvanceService
    ]
})
export class RequestAdvanceModule {}
