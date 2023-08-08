import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/core/modules/shared.module";
import { LugarTrabajoComponent } from "./lugar-trabajo.component";
import { LugarTrabajoRouting } from "./lugar-trabajo.routing";
import { LugarTrabajoService } from "./lugar-trabajo.service";

@NgModule({
    declarations: [
        LugarTrabajoComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        LugarTrabajoRouting
    ],
    providers: [
        LugarTrabajoService
    ]
})
export class LugarTrabajoModule {}