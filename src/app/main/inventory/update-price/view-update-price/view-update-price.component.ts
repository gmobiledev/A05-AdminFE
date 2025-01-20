import { Component, OnInit } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-view-update-price",
  templateUrl: "./view-update-price.component.html",
  styleUrls: ["./view-update-price.component.scss"],
})
export class ViewUpdatePriceComponent implements OnInit {
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  dataTask = {
    note: "sdfsadf",
    sync_time: null,
    updated_time: null,
    buy_time: null,
    request_time: null,
    otp: null,
    number_success_msisdn: null,
    user_sync: "quy.nn.@gmobile.vn",
    status: 5,
    id: 123132121,
  };
  listDataSim = [
    {
      msisdn: "0999999999",
      serial: 12345678910,
      status: 1,
    },
    {
      msisdn: "0999999999",
      serial: 12345678910,
      status: 1,
    },
    {
      msisdn: "0999999999",
      serial: 12345678910,
      status: 1,
    }
  ];
  public selectedFilesImage: File[] = [];

  constructor() {}

  ngOnInit(): void {}

  isShowButtonApprove() {
    // if (
    //   this.checkAction(
    //     "telecom-admin/task/:slug(\\d+)/KHOI_PHUC/update-status"
    //   ) ||
    //   this.checkAction(
    //     "telecom-admin/task/:slug(\\d+)/change-customer-subsriber"
    //   )
    // ) {
    //   return true;
    // }
    // return false;
    return true;
  }

  // checkAction(item) {
  //   return this.currentUser
  //     ? this.currentUser.actions.find((itemX) => itemX.includes(item))
  //     : false;
  // }

  select(name: string, typeApprove?: number) {
    // let data;
    // if (name === "approve") {
    //   data = {
    //     status: 1,
    //     note: "duyệt",
    //     want_status: typeApprove,
    //   };
    //   this.approveOrReject(data);
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
    //         status: -1,
    //         note: note,
    //       };
    //       this.approveOrReject(data);
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
    // this.itemBlockUI.start();
    // try {
    //   const check = await this.telecomService.checkAvailabledTask(this.idSlug);
    //   if (check.status === 1) {
    //     this.alertService.showMess(check.message);
    //     this.itemBlockUI.stop();
    //     this.getTaskSlugText(this.idSlug);
    //     return;
    //   } else {
    //     this.alertService.showMess(check.message);
    //     this.itemBlockUI.stop();
    //     return;
    //   }
    // } catch (error) {
    //   this.itemBlockUI.stop();
    //   return;
    // }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      files.forEach((file) => {
        if (file.size > 0) {
          this.selectedFilesImage.push(file);
        }
      });
    }
  }

  deleteFile(index) {
    console.log(index);
    if (index >= 0 && index < this.selectedFilesImage.length) {
      this.selectedFilesImage.splice(index, 1);
    }
  }
}
