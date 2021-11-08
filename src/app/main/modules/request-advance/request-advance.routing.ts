import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RequestAdvanceComponent } from "./request-advance.component";

const routes: Routes = [
    {
        path: '',
        component: RequestAdvanceComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestAdvanceRouting {}
