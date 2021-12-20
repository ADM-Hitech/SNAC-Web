import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RequestWithoutRfcComponent } from "./request-without-rfc.component";

const routes: Routes = [
    {
        path: '',
        component: RequestWithoutRfcComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestWithoutRfcRouting {}
