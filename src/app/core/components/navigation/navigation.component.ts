import { Component, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnDestroy {

  navigationModel: any[];
  navigationModelChangeSubscription: Subscription;

  // tslint:disable-next-line:no-input-rename
  @Input('layout') layout = 'vertical';

  constructor(private navigationService: NavigationService) {
    this.navigationModelChangeSubscription = this.navigationService.onNavigationModelChange
      .subscribe((navigationModel) => {
        this.navigationModel = navigationModel;
      });
  }

  ngOnDestroy() {
    this.navigationModelChangeSubscription.unsubscribe();
  }

}
