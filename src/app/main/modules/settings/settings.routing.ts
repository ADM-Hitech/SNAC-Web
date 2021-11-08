import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { PlatformInfoComponent } from './platform-info/platform-info.component';
import { SecurityComponent } from './security/security.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: '',
                component: SecurityComponent
            },
            {
                path: 'account-info',
                component: AccountInfoComponent
            },
            {
                path: 'platform-info',
                component: PlatformInfoComponent
            },
            {
                path: 'delete-account',
                component: DeleteAccountComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRouting {}