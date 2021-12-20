import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/modules/my-profile/my-profile.module').then(module => module.MyProfileModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./main/modules/login/login.module').then(module => module.LoginModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./main/modules/dashboard-admin/dashboard-admin.module').then(module => module.DashboardAdminModule)
  },
  {
    path: 'users/create-users',
    loadChildren: () => import('./main/modules/create-users/create-users.module').then(module => module.CreateUsersModule)
  },
  {
    path: 'users/investor',
    loadChildren: () => import('./main/modules/investor/investor.module').then(module => module.InvestorModule)
  },
  {
    path: 'users/accredited',
    loadChildren: () => import('./main/modules/accredited/accredited.module').then(module => module.AccreditedModule)
  },
  {
    path: 'users/administrator',
    loadChildren: () => import('./main/modules/administrator/administrator.module').then(module => module.AdministratorModule)
  },
  {
    path: 'fondeo-control',
    loadChildren: () => import('./main/modules/fondeo-control/fondeo-control.module').then(module => module.FondeoControlModule)
  },
  {
    path: 'advances-receivable',
    loadChildren:
      () => import('./main/modules/advances-receivable/advances-receivable.module').then(module => module.AdvancesReceivableModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./main/modules/my-profile/my-profile.module').then(module => module.MyProfileModule)
  },
  {
    path: 'technical-support',
    loadChildren: () => import('./main/modules/technical-support/technical-support.module').then(module => module.TechnicalSupportModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./main/modules/settings/settings.module').then(module => module.SettingsModule)
  },
  {
    path: 'investment',
    loadChildren: () => import('./main/modules/investments/investments.module').then(module => module.InvestmentsModule)
  },
  {
    path: 'aviso-privacidad',
    loadChildren: () => import('./main/modules/aviso-privacidad/aviso-privacidad.module').then(module => module.AvisoPrivasidadModule)
  },
  {
    path: 'terminos-y-condiciones',
    loadChildren: () =>
      import('./main/modules/terminos-condiciones/terminos-condiciones.module').then(module => module.TerminosCondicionesModule)
  },
  {
    path: 'solicitar-adelanto',
    loadChildren: () => import('./main/modules/request-advance/request-advance.module').then(module => module.RequestAdvanceModule)
  },
  {
    path: 'licencias',
    loadChildren: () => import('./main/modules/license/license.module').then(module => module.LicenseModule)
  },
  {
    path: 'licencias/:licenseid/estado-cuenta',
    loadChildren: () => import('./main/modules/account-status-license/account-status-license.module').then(module => module.AccountStatusLicenseModule)
  },
  {
    path: 'licencias/:licenseid/adelanto-cobrar',
    loadChildren: () => import('./main/modules/advances-receivable/advances-receivable.module').then(module => module.AdvancesReceivableModule)
  },
  {
    path: 'registros-pendientes',
    loadChildren: () => import('./main/modules/pending-records/pending-records.module').then(module => module.PendingRecordModule)
  },
  {
    path: 'registros-sin-rfc',
    loadChildren: () => import('./main/modules/request-without-rfc/request-without-rfc.module').then(module => module.RequestWithoutRfcModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
