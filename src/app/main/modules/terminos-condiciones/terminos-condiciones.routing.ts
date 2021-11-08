import { Routes, RouterModule } from '@angular/router';
import { TerminosCondicionesComponent } from './terminos-condiciones.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: TerminosCondicionesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TerminosCondicionesRouting {}
