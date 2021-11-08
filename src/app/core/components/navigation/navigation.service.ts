import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NavigationService {

  onNavCollapseToggle = new EventEmitter<any>();
  onNavCollapseToggled = new EventEmitter<any>();
  onNavigationModelChange: BehaviorSubject<any> = new BehaviorSubject({});
  navigationModel: { model: any[] };
  flatNavigation: any[] = [];
  constructor() { }

  /**
   * Get navigation model
   *
   */
  getNavigationModel(): any[] {
      return this.navigationModel.model;
  }

  /**
   * Set the navigation model
   *
   */
  setNavigationModel(model): void {
      this.navigationModel = model;
      this.onNavigationModelChange.next(this.navigationModel.model);
  }

  /**
   * Add new navigation item
   * to the given location
   */
  addNavigationItem(location, item): void {
      // Parse the location
      const locationArr = location.split('.');

      if ( locationArr.length === 0 ) {
          return;
      }

      // Find the navigation item
      const navItem = this.findNavigationItemById(locationArr);

      // Act according to the item type
      switch ( navItem.type ) {
          case 'item':

              // Create a children array
              navItem.children = [];

              // Push the item
              navItem.children.push(item);

              // Change the item type to collapsable
              navItem.type = 'collapse';

              break;

          case 'collapse':

              // Push the item
              navItem.children.push(item);

              break;

          case 'group':

              // Push the item
              navItem.children.push(item);

              break;

          default:
              break;
      }
  }

  /**
   * Get navigation item from
   * given location
   *
   */
  getNavigationItem(location): void {
      // Parse the location
      const locationArr = location.split('.');

      if ( locationArr.length === 0 ) {
          return;
      }

      // Find and return the navigation item
      return this.findNavigationItemById(locationArr);
  }

  /**
   * Find navigation item by location
   *
   */
  findNavigationItemById(location, navigation?): any {
      if ( !navigation ) {
          navigation = this.navigationModel.model;
      }

      // Iterate through the given navigation
      for ( const navItem of navigation ) {
          // If the nav item id equals the first location...
          if ( navItem.id === location[0] ) {
              // If there is more location to look at...
              if ( location.length > 1 ) {
                  // Remove the first item of the location
                  location.splice(0, 1);

                  // Go nested...
                  return this.findNavigationItemById(location, navItem.children);
              } else { // Otherwise just return the nav item
                  return navItem;
              }
          }
      }
  }

  /**
   * Get flattened navigation array
   */
  getFlatNavigation(navigationItems?): any[] {
      // If navigation items not provided,
      // that means we are running the function
      // for the first time...
      if ( !navigationItems ) {
          // Reset the flat navigation
          this.flatNavigation = [];

          // Get the entire navigation model
          navigationItems = this.navigationModel.model;
      }

      for ( const navItem of navigationItems ) {
          if ( navItem.type === 'subheader' ) {
              continue;
          }

          if ( navItem.type === 'item' ) {
              this.flatNavigation.push({
                  title: navItem.title,
                  type : navItem.type,
                  icon : navItem.icon || false,
                  url  : navItem.url
              });

              continue;
          }

          if ( navItem.type === 'collapse' || navItem.type === 'group' ) {
              if ( navItem.children ) {
                  this.getFlatNavigation(navItem.children);
              }
          }
      }

      return this.flatNavigation;
  }
}
