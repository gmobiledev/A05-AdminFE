import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { TaskTelecom } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ObjectLocalStorage, TaskTelecomStatus } from 'app/utils/constants';

@Component({
  selector: 'app-view-approve',
  templateUrl: './view-approve.component.html',
  styleUrls: ['./view-approve.component.scss']
})
export class ViewApproveComponent implements OnInit, OnDestroy {
  @BlockUI('section-block') itemBlockUI: NgBlockUI;
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() item: any;
  dataImages;
  dataText;
  dataTask;
  idSlug;
  currentUser;
  private _unsubscribeAll: Subject<any>;
  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus = TaskTelecomStatus;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.idSlug = this.item?.id;
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.getTaskSlugText(this.idSlug);
    this.getTaskSlugImages(this.idSlug);
  }

  isShowButtonApprove() {
    if (this.checkAction('telecom-admin/task/:slug(\\d+)/KHOI_PHUC/update-status')) {
      return true;
    }
    return false;
  }

  checkAction(item) {
    return this.currentUser ? this.currentUser.actions.find(itemX => itemX.includes(item)) : false;
  }

  getTaskSlugText(id: any) {
    this.telecomService.getTaskSlugText(id).subscribe(res => {
      if (res.status === 1 && res.data) {
        this.dataText = res.data;
        this.dataTask = res.data?.task;

      } else {
        this.alertService.showMess(res.message);
      };
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }

  getTaskSlugImages(id: any) {
    this.telecomService.getTaskSlugImages(id).subscribe(res => {
      if (res.status === 1 && res.data) {
        this.dataImages = res.data;
      } else {
        this.alertService.showMess(res.message);
      };
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }

  select(name: string) {
    let status;
    let note = '';
    if (name === 'approve') {
      note = 'duyệt';
      status = 1
    } else {
      note = 'hủy yêu cầu';
      status = -1
    }

    const data = {
      status: status,
      note: note
    }
    this.telecomService.postUpdateStatus(this.idSlug, data).subscribe((res: any) => {
      if (res.status === 1) {
        this.closePopup.next();
        this.alertService.showMess(res.message);
      } else {
        this.closePopup.next();
        this.alertService.showMess(res.message);
      };
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}