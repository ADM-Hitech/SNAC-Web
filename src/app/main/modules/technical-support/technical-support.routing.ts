import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechnicalSupportComponent } from './technical-support.component';

const routes: Routes = [
    {
        path: '',
        component: TechnicalSupportComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TechnicalSupportRouting {}
