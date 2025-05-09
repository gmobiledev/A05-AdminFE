import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TelecomService } from "app/auth/service/telecom.service";
import { ObjectLocalStorage, StatusUpdatePrice } from "app/utils/constants";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import Swal from "sweetalert2";

@Component({
  selector: "app-view-update-price",
  templateUrl: "./view-update-price.component.html",
  styleUrls: ["./view-update-price.component.scss"],
})
export class ViewUpdatePriceComponent implements OnInit {
  @BlockUI("section-block") itemBlockUIView: NgBlockUI;
  @Input() idTask: any;
  @Input() selectView: any;
  @Output() close = new EventEmitter();
  attachments;
  dataProducts;
  url;
  type = "";
  currentUser;
  @ViewChild("modalViewFileTask") modalViewFileTask: ElementRef;
  public selectedFilesImage: File[] = [];
  countDataSim;
  @ViewChild("modalItemViewOtp") modalItemViewOtp: ElementRef;
  public modalRef: any;
  public statusUpdatePrice = StatusUpdatePrice;

  constructor(
    private modalService: NgbModal,
    private telecomService: TelecomService,
    private alertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(
      localStorage.getItem(ObjectLocalStorage.CURRENT_USER)
    );
    this.viewDetailPriceUpdate(this.idTask);
  }

  viewDetailPriceUpdate(id) {
    this.telecomService.getDataDetailPriceUpdate(id).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.dataProducts = res.data;
          this.countDataSim = this.dataProducts?.products?.count;
          if (this.dataProducts.batch.attachments) {
            this.attachments = JSON.parse(this.dataProducts.batch.attachments)
              ? JSON.parse(this.dataProducts.batch.attachments)
              : "";
          }
        } else {
          this.alertService.showMess(res.message);
        }
        this.itemBlockUIView.stop();
      },
      (err) => {
        this.itemBlockUIView.stop();
        this.alertService.showMess(err);
      }
    );
  }

  onSelectChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
  }

  async modalOpenFileTask(modalViewFileTask, item = null) {
    if (item) {
      this.modalRef = this.modalService.open(modalViewFileTask);
      const data = {
        url: item.path,
      };
      this.itemBlockUIView.start();
      this.telecomService.postViewFileTask(this.idTask, data).subscribe(
        (res: any) => {
          console.log("postViewFileTask", res);

          if (res.status === 1) {
            if (
              res.data[0].name.includes("jpg") ||
              res.data[0].name.includes("png") ||
              res.data[0].name.includes("jpeg")
            ) {
              this.type = "img";
            } else if (res.data[0].name.includes("pdf")) {
              this.type = "pdf";
            } else if (
              res.data[0].name.includes("mp4") ||
              res.data[0].name.includes("MP4")
            ) {
              this.type = "video";
            }
            if (
              res.data[0].value &&
              res.data[0].value != null &&
              res.data[0].value != ""
            ) {
              this.url = res.data[0].value;
            } else {
              this.alertService.showMess("Url không có vui lòng kiểm tra lại!");
            }
          }
          this.itemBlockUIView.stop();
        },
        (err) => {
          this.itemBlockUIView.stop();
          this.alertService.showMess(err);
        }
      );
    }
  }

  closePopupAll(event) {
    console.log(event);
    if (event === false) {
      this.modalRef.close();
    } else {
      this.modalRef.close();
      this.close.next();
    }
  }

  isShowButtonApprove() {
    if (
      this.checkAction("telecom-admin/product/check-request-available") &&
      this.checkAction("telecom-admin/product/reject-batch") &&
      this.checkAction("telecom-admin/product/price-update/verify-otp")
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

  select(name: string, typeApprove?: number) {
    if (name === "approve") {
      this.modalOpen(this.modalItemViewOtp);
    } else {
      Swal.fire({
        title: "Nhập lý do từ chối yêu cầu",
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
            .postRejectBatch({
              batchId: this.idTask,
              note: note,
            })
            .subscribe(
              (res) => {
                if (res.status == 1) {
                  this.alertService.showMess(res.message);
                  this.close.next();
                }
              },
              (err) => {
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
    }
  }

  async reception() {
    this.itemBlockUIView.start();
    try {
      const check = await this.telecomService.checkRequestAvailable({
        batchId: this.idTask,
      });
      if (check.status === 1) {
        this.alertService.showMess(check.message);
        this.itemBlockUIView.stop();
        this.viewDetailPriceUpdate(this.idTask);
        return;
      } else {
        this.alertService.showMess(check.message);
        this.itemBlockUIView.stop();
        return;
      }
    } catch (error) {
      this.itemBlockUIView.stop();
      return;
    }
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

  modalClose() {
    this.modalRef.close();
  }

  async modalOpen(modal, item = null) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "md",
      backdrop: "static",
      keyboard: false,
    });
  }
}
