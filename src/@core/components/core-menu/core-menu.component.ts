import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { ObjectLocalStorage } from 'app/utils/constants';
import { AuthenticationService } from 'app/auth/service';
import { menu as coreMenu } from 'app/menu/menu';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _coreMenuService: CoreMenuService,
    private _authenticationService: AuthenticationService
    ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    // this.menu = this.menu || this._coreMenuService.getCurrentMenu();
    // let menuTmp = coreMenu.map(obj => ({...obj}));
    this.menu = coreMenu.map(obj => ({...obj}));
    // console.log("coreMenu", coreMenu);
    
    // this._authenticationService.currentUser.subscribe(currentUser => {
    //   console.log("currentUser", currentUser);
    //   if(currentUser && currentUser.menus && currentUser.menus.length > 0) {
    //     for(let i = 0; i<this.menu.length; i++) {
    //       this.menu[i].children = this.menu[i].children.filter(x => {return currentUser.menus.includes(x.url)});
    //     }
    //     this.menu = this.menu.filter(x => {return x.children.length > 0});
    //   }
      
    // });
    // const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    // if(currentUser && currentUser.menus && currentUser.menus.length > 0) {
    //   for(let i = 0; i<this.menu.length; i++) {
    //     this.menu[i].children = this.menu[i].children.filter(x => {return currentUser.menus.includes(x.url)});
    //   }
    //   this.menu = this.menu.filter(x => {return x.children.length > 0});
    // }

    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // console.log("this.menu", this.menu);
      this.currentUser = this._coreMenuService.currentUser;

      // Load menu
      // this.menu = this._coreMenuService.getCurrentMenu();
      
      const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
      const currentUser2 = this._authenticationService.currentUserValue;
      // console.log("currentUser", currentUser);
      // console.log("currentUser2", currentUser2);
      if(currentUser && currentUser.menus && currentUser.menus.length > 0) {
        for(let i = 0; i<this.menu.length; i++) {
          this.menu[i].children = this.menu[i].children.filter(x => {return currentUser.menus.includes(x.url)});
        }
        this.menu = this.menu.filter(x => {return x.children.length > 0});
      }
      // console.log("this.menu updated", this.menu);
      this._changeDetectorRef.markForCheck();
    });
  }
}
