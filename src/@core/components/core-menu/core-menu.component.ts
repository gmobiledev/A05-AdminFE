import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { ObjectLocalStorage } from 'app/utils/constants';

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
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService) {
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
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();
    
    const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    if(currentUser && currentUser.menus && currentUser.menus.length > 0) {
      for(let i = 0; i<this.menu.length; i++) {
        this.menu[i].children = this.menu[i].children.filter(x => {return currentUser.menus.includes(x.url)});
      }
      this.menu = this.menu.filter(x => {return x.children.length > 0});
    }

    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._coreMenuService.currentUser;

      // Load menu
      this.menu = this._coreMenuService.getCurrentMenu();
      const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
      if(currentUser && currentUser.menus && currentUser.menus.length > 0) {
        for(let i = 0; i<this.menu.length; i++) {
          this.menu[i].children = this.menu[i].children.filter(x => {return currentUser.menus.includes(x.url)});
        }
        this.menu = this.menu.filter(x => {return x.children.length > 0});
      }
      this._changeDetectorRef.markForCheck();
    });
  }
}
