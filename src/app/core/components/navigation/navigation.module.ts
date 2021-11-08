import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { AppNavHorizontalCollapseComponent } from './horizontal/nav-collapse/nav-horizontal-collapse.component';
import { AppNavHorizontalItemComponent } from './horizontal/nav-item/nav-horizontal-item.component';
import { AppNavVerticalGroupComponent } from './vertical/nav-group/nav-vertical-group.component';
import { AppNavVerticalCollapseComponent } from './vertical/nav-collapse/nav-vertical-collapse.component';
import { AppNavVerticalItemComponent } from './vertical/nav-item/nav-vertical-item.component';
import { SharedModule } from '../../modules/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    CommonModule
  ],
  declarations: [
    AppNavHorizontalCollapseComponent,
    AppNavHorizontalItemComponent,
    AppNavVerticalGroupComponent,
    AppNavVerticalCollapseComponent,
    AppNavVerticalItemComponent,
    NavigationComponent
  ],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
