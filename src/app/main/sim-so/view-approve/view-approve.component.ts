import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { TelecomService } from "app/auth/service/telecom.service";
import { TaskTelecom } from "app/utils/constants";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Subject } from "rxjs";
import { ObjectLocalStorage, TaskTelecomStatus } from "app/utils/constants";
import Swal from "sweetalert2";
import { AdminService } from "app/auth/service/admin.service";

@Component({
  selector: "app-view-approve",
  templateUrl: "./view-approve.component.html",
  styleUrls: ["./view-approve.component.scss"],
})
export class ViewApproveComponent implements OnInit, OnDestroy {
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() item: any;
  dataImages;
  dataText;
  dataTask;
  idSlug;
  titleModal;
  showSelect = false;
  showTask = true;
  currentUser;
  public actionText = "Đấu nối";
  private _unsubscribeAll: Subject<any>;
  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus = TaskTelecomStatus;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    console.log(this.item);
    if (this.item) {
      if (this.item.action == "KHOI_PHUC") {
        this.titleModal = "Khôi phục sim";
      } else if (
        this.item.action == this.listTaskAction.change_user_info.value
      ) {
        this.titleModal = "Chuyển đổi chủ quyền";
      } else if (
        this.item.action == this.listTaskAction.app_request_change_user_info.value
      ) {
        this.titleModal = this.listTaskAction.app_request_change_user_info.label;
      }
    }
    this.idSlug = this.item?.id;
    this.currentUser = JSON.parse(
      localStorage.getItem(ObjectLocalStorage.CURRENT_USER)
    );
    this.getTaskSlugText(this.idSlug);
    this.getTaskSlugImages(this.idSlug);
  }

  isShowButtonApprove() {
    if (
      this.checkAction(
        "telecom-admin/task/:slug(\\d+)/KHOI_PHUC/update-status"
      ) ||
      this.checkAction(
        "telecom-admin/task/:slug(\\d+)/change-customer-subsriber"
      )
    ) {
      return true;
    }
    return false;
  }

  checkAction(item) {
    return this.currentUser
      ? this.currentUser.actions.find((itemX) => itemX.includes(item))
      : false;
  }

  getTaskSlugText(id: any) {
    this.telecomService.getTaskSlugText(id).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.dataText = res.data;
          this.dataTask = res.data?.task;
          this.checkStatus();
        } else {
          this.alertService.showMess(res.message);
        }
        this.itemBlockUI.stop();
      },
      (err) => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      }
    );
  }

  checkStatus() {
    if (
      this.dataTask.status == this.taskTelecomStatus.STATUS_NEW_ORDER ||
      this.dataTask?.status == TaskTelecomStatus.STATUS_PROCESSING
    ) {
      this.showSelect = true;
    }
    if (this.dataTask?.status == TaskTelecomStatus.STATUS_PROCESSING) {
      this.showTask =
        this.dataTask.sync_by == this.currentUser.id ? true : false;
    }
  }

  getTaskSlugImages(id: any) {
    this.telecomService.getTaskSlugImages(id).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.dataImages = res.data;
        } else {
          this.alertService.showMess(res.message);
        }
        this.itemBlockUI.stop();
      },
      (err) => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      }
    );
  }

  async reception() {
    this.itemBlockUI.start();
    try {
      const check = await this.telecomService.checkAvailabledTask(this.idSlug);
      if (check.status === 1) {
        this.alertService.showMess(check.message);
        this.itemBlockUI.stop();
        this.getTaskSlugText(this.idSlug);
        return;
      } else {
        this.alertService.showMess(check.message);
        this.itemBlockUI.stop();
        return;
      }
    } catch (error) {
      this.itemBlockUI.stop();
      return;
    }
  }

  select(name: string, typeApprove?: number) {
    if (this.item.action == "KHOI_PHUC") {
      let data;
      if (name === "approve") {
        data = {
          status: 1,
          note: "duyệt",
          want_status: typeApprove,
        };
        this.approveOrReject(data);
      } else {
        Swal.fire({
          title: "Từ chối yêu cầu, gửi lý do cho đại lý",
          input: "textarea",
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Gửi",
          showLoaderOnConfirm: true,
          preConfirm: (note) => {
            if (!note || note == "") {
              Swal.showValidationMessage("Vui lòng nhập nội dung");
              return;
            }
            data = {
              status: -1,
              note: note,
            };
            this.approveOrReject(data);
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            //this.updateStatus.emit({updated: true});
            this.alertService.showSuccess("Thành công");
          }
        });
      }
    } else if (this.item.action == "app_request_change_user_info") {
      let titleS;
      if (name === "approve") {
        titleS = "Chấp nhận yêu cầu, gửi lý do cho đại lý";
      } else {
        titleS = "Từ chối yêu cầu, gửi lý do cho đại lý";
      }
      Swal.fire({
        title: titleS,
        input: "textarea",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Gửi",
        showLoaderOnConfirm: true,
        preConfirm: (note) => {
          if (!note || note == "") {
            Swal.showValidationMessage("Vui lòng nhập nội dung");
            return;
          }
          let data;
          if (name === "approve") {
            data = {
              status: 1,
              task_id: this.idSlug,
              note: note,
            };
          } else {
            data = {
              status: 0,
              task_id: this.idSlug,
              note: note,
            };
          }
          this.telecomService.approveRequestChangeInfo(data).subscribe(
            (res: any) => {
              if (res.status === 1) {
                this.closePopup.next();
                Swal.close();
                this.alertService.showMess(res.message);
              } else {
                this.closePopup.next();
                Swal.close();
                this.alertService.showMess(res.message);
              }
              this.itemBlockUI.stop();
            },
            (err) => {
              this.itemBlockUI.stop();
              this.alertService.showMess(err);
            }
          );
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess("Thành công");
        }
      });
    } else {
      if (name === "approve") {
        this.asyncToMnoViaApi();
      } else {
        this.onUpdateStatus(this.item, this.taskTelecomStatus.STATUS_REJECT);
      }
    }
  }

  async asyncToMnoViaApi() {
    let confirmMessage = "Xác nhận chuyển đổi chủ quyền TTTB";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.itemBlockUI.start();
      this.telecomService.asyncToMnoViaApi(this.item).subscribe(
        (res) => {
          if (res.status === 1) {
            this.closePopup.next();
            this.alertService.showMess(res.message);
          } else {
            this.closePopup.next();
            this.alertService.showMess(res.message);
          }
          this.itemBlockUI.stop();
        },
        (error) => {
          this.itemBlockUI.stop();
          this.alertService.showError(error, 15000);
        }
      );
    }
  }

  approveOrReject(data: any){
    this.telecomService.postUpdateStatus(this.idSlug, data).subscribe(
      (res: any) => {
        if (res.status === 1) {
          this.closePopup.next();
          this.alertService.showMess(res.message);
        } else {
          this.closePopup.next();
          this.alertService.showMess(res.message);
        }
        this.itemBlockUI.stop();
      },
      (err) => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      }
    );
  }

  async onUpdateStatus(item, status) {
    let titleS = "Từ chối yêu cầu, gửi lý do cho đại lý";
    Swal.fire({
      title: titleS,
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Gửi",
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        if (!note || note == "") {
          Swal.showValidationMessage("Vui lòng nhập nội dung");
          return;
        }
        this.telecomService
          .updateTaskStatus(item.id, { status: status, note: note })
          .subscribe(
            (res) => {
              if (!res.status) {
                Swal.close();
                Swal.showValidationMessage(res.message);
                // this.alertService.showError(res.message);
                return;
              }
              Swal.close();
              this.closePopup.next();
            },
            (error) => {}
          );

        const listPhone =
          this.item.msisdn.msisdns.length > 1
            ? this.item.msisdn.msisdns
                .map((x) => {
                  return x.msisdn;
                })
                .join("-")
            : this.item.msisdn.msisdns[0].msisdn;
        const dataPushNotify = {
          user_ids: [this.item.request_by],
          message: `Yêu cầu ${this.actionText} ID ${this.item.id} bị từ chối: ${note}`,
          title: `${this.actionText} số ${listPhone}`,
          data: {
            type: this.item.action,
            status: status + "",
            message: `Yêu cầu ${this.actionText} ID ${this.item.id} bị từ chối: ${note}`,
            id: this.item.id + "",
          },
        };
        console.log(dataPushNotify);
        this.adminService.pushNotify(dataPushNotify).subscribe((res) => {});
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        //this.updateStatus.emit({updated: true});
        this.alertService.showSuccess("Thành công");
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
