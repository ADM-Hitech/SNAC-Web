import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionWelcomeComponent } from './section-welcome/section-welcome.component';
import { SectionIntroComponent } from './section-intro/section-intro.component';
import { SectionDownloadComponent } from './section-download/section-download.component';
import { SectionHowWorkComponent } from './section-how-work/section-how-work.component';
import { SectionRequirementsComponent } from './section-requirements/section-requirements.component';
import { SectionEmployerComponent } from './section-employer/section-employer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageRouting } from './landing-page.routing';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { SectionVideoComponent } from './section-video/section-video.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    SectionWelcomeComponent,
    SectionIntroComponent,
    SectionDownloadComponent,
    SectionHowWorkComponent,
    SectionRequirementsComponent,
    SectionEmployerComponent,
    LandingPageComponent,
    SectionVideoComponent
  ],
  imports: [
    LandingPageRouting,
    SharedModule,
    CommonModule,
    YouTubePlayerModule
  ]
})
export class LandingPageModule { }
