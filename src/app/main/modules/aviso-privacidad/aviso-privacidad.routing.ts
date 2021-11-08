import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvisoPrivasidadComponent } from './aviso-privacidad.component';

const routes: Routes = [
    {
        path: '',
        component: AvisoPrivasidadComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AvisoPrivasidadRouting {}
