import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './core/modules/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MainModule } from './main/main.module';
import { AppSplashScreenService } from './core/services/splash-screen.service';
import { AppConfigService } from './core/services/config.service';
import { NavigationService } from './core/components/navigation/navigation.service';
import { AppTranslationLoaderService } from './core/services/translation-loader.service';
import { InterceptorService } from './core/services/rest/interceptor.service';
import { NgxMaskModule } from 'ngx-mask';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { GestureConfig } from '@angular/material';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    TranslateModule.forRoot(),
    MainModule,
    NgxMaskModule.forRoot(),
    ScrollToModule.forRoot(),
    HammerModule
  ],
  providers: [
    AppSplashScreenService,
    AppConfigService,
    NavigationService,
    AppTranslationLoaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
