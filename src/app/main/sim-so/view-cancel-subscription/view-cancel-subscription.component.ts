import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TelecomService } from "app/auth/service/telecom.service";
import { ObjectLocalStorage, TaskTelecomStatus } from "app/utils/constants";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-view-cancel-subscription",
  templateUrl: "./view-cancel-subscription.component.html",
  styleUrls: ["./view-cancel-subscription.component.scss"],
})
export class ViewCancelSubscriptionComponent implements OnInit {
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() item: any;
  viewImage;
  public modalRef: any;
  showSelect = false;
  showTask = true;
  data;
  idSlug;
  currentUser;
  public taskTelecomStatus = TaskTelecomStatus;

  constructor(
    private modalService: NgbModal,
    private telecomService: TelecomService,
    private alertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.idSlug = this.item?.id;
    this.currentUser = JSON.parse(
      localStorage.getItem(ObjectLocalStorage.CURRENT_USER)
    );
    this.getData();
  }

  select(name: string) {
    // let data;
    // if (name === "approve") {
    //   data = {
    //     status: 1,
    //     note: "duyệt",
    //     taskId: this.idSlug,
    //   };
    //   this.approveUpdateDoc(data);
    // } else {
    //   Swal.fire({
    //     title: "Từ chối yêu cầu, gửi lý do cho đại lý",
    //     input: "textarea",
    //     inputAttributes: {
    //       autocapitalize: "off",
    //     },
    //     showCancelButton: true,
    //     confirmButtonText: "Gửi",
    //     showLoaderOnConfirm: true,
    //     preConfirm: (note) => {
    //       if (!note || note == "") {
    //         Swal.showValidationMessage("Vui lòng nhập nội dung");
    //         return;
    //       }
    //       data = {
    //         status: 40,
    //         note: note,
    //         taskId: this.idSlug,
    //       };
    //       this.approveUpdateDoc(data);
    //     },
    //     allowOutsideClick: () => !Swal.isLoading(),
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       //this.updateStatus.emit({updated: true});
    //       this.alertService.showSuccess("Thành công");
    //     }
    //   });
    // }
  }

  async reception() {
    this.itemBlockUI.start();
    try {
      // const check = await this.telecomService.checkAvailabledTask(this.idSlug);
      // if (check.status === 1) {
      //   this.alertService.showMess(check.message);
      //   this.itemBlockUI.stop();
      //   // this.getTaskSlugText(this.idSlug);
      //   return;
      // } else {
      //   this.alertService.showMess(check.message);
      //   this.itemBlockUI.stop();
      //   return;
      // }
    } catch (error) {
      this.itemBlockUI.stop();
      return;
    }
  }

  getData() {
    this.telecomService.getDetailTask(this.idSlug, 1).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.data = res.data;
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

  isShowButtonApprove() {
    // if (
    //   this.checkAction("telecom-admin/task/:slug(\\d+)/check-available") &&
    //   this.checkAction("telecom-admin/task/approve-update-doc")
    // ) {
    //   return true;
    // }
    // return false;
    return true;
  }

  checkStatus() {
    if (
      this.data?.task?.status == this.taskTelecomStatus.STATUS_NEW_ORDER ||
      this.data?.task?.status == TaskTelecomStatus.STATUS_PROCESSING
    ) {
      this.showSelect = true;
    }
    if (this.data?.task?.status == TaskTelecomStatus.STATUS_PROCESSING) {
      this.showTask =
        this.data?.task.sync_by == this.currentUser.id ? true : false;
    }
  }

  onViewImage(modal, imageBase64) {
    this.viewImage = "data:image/png;base64," + imageBase64;

    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "xl",
    });
  }

  onCloseModalImage() {
    this.viewImage = null;
    this.modalRef.close();
  }
}
