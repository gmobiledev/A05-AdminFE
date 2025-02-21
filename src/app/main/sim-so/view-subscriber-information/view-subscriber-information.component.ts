import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TelecomService } from "app/auth/service/telecom.service";
import { ObjectLocalStorage, TaskTelecomStatus } from "app/utils/constants";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-subscriber-information",
  templateUrl: "./view-subscriber-information.component.html",
  styleUrls: ["./view-subscriber-information.component.scss"],
})
export class ViewSubscriberInformationComponent implements OnInit {
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() item: any;
  dataTask;
  dataText;
  dataImages;
  showSelect = false;
  showTask = true;
  idSlug;
  currentUser;
  public taskTelecomStatus = TaskTelecomStatus;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.idSlug = this.item?.id;
    this.currentUser = JSON.parse(
      localStorage.getItem(ObjectLocalStorage.CURRENT_USER)
    );
    this.getTaskSlugText(this.idSlug);
    this.postCompareImage(this.idSlug);
  }

  checkAction(item) {
    return this.currentUser
      ? this.currentUser.actions.find((itemX) => itemX.includes(item))
      : false;
  }

  isShowButtonApprove() {
    if (
      this.checkAction("telecom-admin/task/:slug(\\d+)/check-available") &&
      this.checkAction("telecom-admin/task/approve-update-doc")
    ) {
      return true;
    }
    return false;
  }

  select(name: string) {
    let data;
    if (name === "approve") {
      data = {
        status: 30,
        note: "duyệt",
        taskId: this.idSlug,
      };
      this.approveUpdateDoc(data);
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
            status: 40,
            note: note,
            taskId: this.idSlug,
          };
          this.approveUpdateDoc(data);
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess("Thành công");
        }
      });
    }
  }

  approveUpdateDoc(data: any) {
    this.telecomService.postApproveUpdateDoc(data).subscribe(
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

  getTaskSlugText(id: any) {
    this.telecomService.postTextCompareDoc(id).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.dataText = res.data;
          this.dataTask = res.data?.task;
          this.item = res.data?.task;
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

  postCompareImage(id: any) {
    this.telecomService.postCompareImage(id).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.dataImages = res.data;
          console.log("dataImages", this.dataImages);
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
}
