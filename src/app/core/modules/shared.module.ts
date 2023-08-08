import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { AppMatSidenavHelperDirective,
          AppMatSidenavTogglerDirective } from '../directives/app-mat-sidenav-helper/app-mat-sidenav-helper.directive';
import { AppMatSidenavHelperService } from '../directives/app-mat-sidenav-helper/app-mat-sidenav-helper.service';
import { Constant } from '../services/constant';
import { AppPipesModule } from '../pipes/pipes.modules';
import { AppIfOnDomDirective } from '../directives/app-if-on-dom.directive';
import { AppPerfectScrollbarDirective } from '../directives/app-perfect-scrollbar.directive';
import { IntroLandingWidgetComponent } from '../components/intro-landing-widget/intro-landing-widget.component';
import { ModalConfirmComponent } from '../components/modal-confirm/modal-confirm.component';
import { SnakBarAlertComponent } from '../components/snak-bar-alert/snak-bar-alert.component';
import { ObserversModule } from '@angular/cdk/observers';
import { IconUserComponent } from '../components/icon-user/icon-user.component';
import { WidgetUserComponent } from '../components/widget-user/widget-user.component';
import { AppMatchMedia } from '../services/match-media.service';
import { AppNavbarService } from '../../main/navbar/navbar.service';
import { EditInvestorComponent } from '../components/edit-investor/edit-investor.component';
import { NewCallCapitalComponent } from '../components/new-call-capital/new-call-capital.component';
import { EditAccreditedComponent } from '../components/edit-accredited/edit-accredited.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { EditAdminComponent } from '../components/edit-admin/edit-admin.component';
import { AccountStatusComponent } from '../components/account-status/account-status.component';
import { DetailsInvesmentComponent } from '../components/details-invesment/details-invesment.component';
import { ModalContactComponent } from '../components/modal-contact/modal-contact.component';
import { DetailsAdvancesAcreditedComponent } from '../components/details-advances-acredited/details-advances-acredited.component';
import { PayCompanyComponent } from '../components/pay-company/pay-company.component';
import { NgxMaskModule } from 'ngx-mask';
import { FinalizeCallCapitalComponent } from '../components/finalize-call-capital/finalize-call-capital.component';
import { UploadVoucherCapitalComponent } from '../components/upload-voucher-capital/upload-voucher-capital.component';
import { CookieService } from 'ngx-cookie-service';
import { DetailsPaymentComponent } from '../components/details-payment/details-payment.component';
import { AddSettingsComponent } from '../components/add-settings/add-settings.component';
import { ChangePasswordModalComponent } from '../components/change-password/change-password.component';
import { AddSettingsAdvancesComponent } from '../components/add-settings-advances/add-settings-advances.component';
import { NewAdvanceComponent } from '../components/new-advance/new-advance.component';
import { ConfirmAdvanceComponent } from '../components/confirm-advance/confirm-advance.component';
import { UploadPayrollReceiptComponent } from '../components/upload-payroll-receipt/upload-payroll-receipt.component';
import { WelcomeSnacComponent } from '../components/welcome-snac/welcome-snac.component';
import { VerifySelfieComponent } from '../components/verify-selfie/verify-selfie.component';
import { VerifyIneComponent } from '../components/verify-ine/verify-ine.component';
import { VerifyAccountStatusComponent } from '../components/verify-account-status/verify-account-status.component';
import { UploadingFilesComponent } from '../components/uploading-files/uploading-files.component';
import { EditLicenseComponent } from '../components/edit-license/edit-license.component';
import { PreviewDocumentComponent } from '../components/preview_document/preview_document.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditEmailComponent } from '../components/edit-email/edit-email.component';
import { ShowCartaMandatoComponent } from '../components/show-carta-mandato/show-carta-mandato.component';
import { ShowConvenioComponent } from '../components/show-convenio/show-convenio.component';
import { ShowCartaTransferenciaDataComponent } from '../components/show-carta-transferencia-data/show-carta-transferencia-data.component';
import { AvisoPrivacidadComponent } from '../components/aviso-privacidad/aviso-privacidad.component';
import { BinariaService } from '../services/binaria.service';
import { ViewInstructionsComponent } from '../components/view-instructions/view-instructions.component';
import { CompleteUploadFilesComponent } from '../components/comple-upload-files/comple-upload-files.component';
import { EditBankInfoComponent } from '../components/edit-bank-info/edit-bank-info.component';

@NgModule({
  declarations: [
    AppMatSidenavHelperDirective,
    AppMatSidenavTogglerDirective,
    AppPerfectScrollbarDirective,
    AppIfOnDomDirective,
    ModalConfirmComponent,
    SnakBarAlertComponent,
    IntroLandingWidgetComponent,
    IconUserComponent,
    WidgetUserComponent,
    EditInvestorComponent,
    NewCallCapitalComponent,
    EditAccreditedComponent,
    EditAdminComponent,
    AccountStatusComponent,
    DetailsInvesmentComponent,
    ModalContactComponent,
    DetailsAdvancesAcreditedComponent,
    PayCompanyComponent,
    FinalizeCallCapitalComponent,
    UploadVoucherCapitalComponent,
    DetailsPaymentComponent,
    AddSettingsComponent,
    ChangePasswordModalComponent,
    AddSettingsAdvancesComponent,
    NewAdvanceComponent,
    ConfirmAdvanceComponent,
    UploadPayrollReceiptComponent,
    WelcomeSnacComponent,
    VerifySelfieComponent,
    VerifyIneComponent,
    VerifyAccountStatusComponent,
    UploadingFilesComponent,
    EditLicenseComponent,
    PreviewDocumentComponent,
    EditEmailComponent,
    ShowCartaMandatoComponent,
    ShowConvenioComponent,
    ShowCartaTransferenciaDataComponent,
    AvisoPrivacidadComponent,
    ViewInstructionsComponent,
    CompleteUploadFilesComponent,
    EditBankInfoComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipesModule,
    ObserversModule,
    UiSwitchModule,
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    PdfViewerModule
  ],
  exports: [
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppMatSidenavHelperDirective,
    AppMatSidenavTogglerDirective,
    AppPerfectScrollbarDirective,
    AppIfOnDomDirective,
    AppPipesModule,
    CommonModule,
    ObserversModule,
    IntroLandingWidgetComponent,
    IconUserComponent,
    UiSwitchModule,
    WidgetUserComponent,
    NgxMaskModule
  ],
  providers: [
    AppMatSidenavHelperService,
    AppNavbarService,
    AppMatchMedia,
    Constant,
    CookieService,
    PdfViewerModule,
    BinariaService
  ],
  entryComponents: [
    ModalConfirmComponent,
    SnakBarAlertComponent,
    EditInvestorComponent,
    EditAccreditedComponent,
    NewCallCapitalComponent,
    EditAdminComponent,
    AccountStatusComponent,
    DetailsInvesmentComponent,
    ModalContactComponent,
    DetailsAdvancesAcreditedComponent,
    PayCompanyComponent,
    FinalizeCallCapitalComponent,
    UploadVoucherCapitalComponent,
    DetailsPaymentComponent,
    AddSettingsComponent,
    ChangePasswordModalComponent,
    AddSettingsAdvancesComponent,
    NewAdvanceComponent,
    ConfirmAdvanceComponent,
    UploadPayrollReceiptComponent,
    WelcomeSnacComponent,
    VerifySelfieComponent,
    VerifyIneComponent,
    VerifyAccountStatusComponent,
    UploadingFilesComponent,
    EditLicenseComponent,
    PreviewDocumentComponent,
    EditEmailComponent,
    ShowCartaMandatoComponent,
    ShowConvenioComponent,
    ShowCartaTransferenciaDataComponent,
    AvisoPrivacidadComponent,
    ViewInstructionsComponent,
    CompleteUploadFilesComponent,
    EditBankInfoComponent
  ]
})
export class SharedModule { }
