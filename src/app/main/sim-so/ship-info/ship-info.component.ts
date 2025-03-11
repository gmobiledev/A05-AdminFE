import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AdminService } from "app/auth/service/admin.service";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";

@Component({
  selector: "app-ship-info",
  templateUrl: "./ship-info.component.html",
  styleUrls: ["./ship-info.component.scss"],
})
export class ShipInfoComponent implements OnInit {
  @Input() item;
  public detail;
  public ship_tracking;
  public ship_code;
  shipDateNote;
  nameProvinces;
  nameDistricts;
  nameCommunes;
  showSubmit = false;
  public modalRef: any;
  @ViewChild("modalUpdateDeliveryStatus") modalUpdateDeliveryStatus: ElementRef;

  constructor(
    private alertService: SweetAlertService,
    private adminSerivce: AdminService,
    private telecomService: TelecomService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.item) {
      this.detail = JSON?.parse(this.item.detail);
      console.log(9999, this.detail);
      if (this.detail?.ship_status !== 1 && this.detail?.ship_status) {
        this.showSubmit = true;
      }
      if (this.detail["ship_tracking"]) {
        this.ship_tracking = this.detail["ship_tracking"];
      }
      if (this.detail["ship_code"]) {
        this.ship_code = this.detail["ship_code"];
      }
      if (
        this.detail["province"] &&
        this.detail["district"] &&
        this.detail["commune"]
      ) {
        this.getProvinces();
        this.getDistricts();
        this.getCommunes();
      }
    }
  }

  modalClose() {
    this.modalRef.close();
  }

  async modalOpen(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  async getProvinces() {
    await this.adminSerivce.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.nameProvinces = res.data.find(
          (x) => x.id == Number(this.detail.province)
        ).title;
      }
    });
  }

  async getDistricts() {
    try {
      const res = await this.adminSerivce
        .getDistricts(this.detail.province)
        .toPromise();
      if (res.status == 1) {
        this.nameDistricts = res.data.find(
          (x) => x.id == Number(this.detail.district)
        ).title;
      }
    } catch (error) {}
  }

  async getCommunes() {
    try {
      const res = await this.adminSerivce
        .getCommunes(this.detail.district)
        .toPromise();
      if (res.status == 1) {
        this.nameCommunes = res.data.find(
          (x) => x.id == Number(this.detail.commune)
        ).title;
      }
    } catch (error) {}
  }

  copyTextClipboard(text: string) {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.alertService.showSuccessToast("Đã copy thành công");
  }

  async onSubmitShipTracking() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý lưu lại")).value) {
      if (
        !this.ship_tracking ||
        this.ship_tracking == undefined ||
        !this.ship_code ||
        this.ship_code == undefined
      ) {
        this.alertService.showMess("Vui lòng nhập link và mã vận đơn");
        return;
      }

      this.telecomService
        .submitShipTracking({
          ship_code: this.ship_code,
          ship_tracking: this.ship_tracking,
          task_id: this.item.id,
        })
        .subscribe(
          (res) => {
            if (!res.status) {
              this.alertService.showMess(res.message);
              return;
            }
            this.alertService.showSuccess(res.message);
            this.modalClose()
          },
          (err) => {
            this.alertService.showMess(err);
          }
        );
    }
  }

  async submit() {
    if (!this.shipDateNote) {
      this.alertService.showMess("Vui lòng nhập ngày nhận sim");
      return;
    }
    console.log();

    const [year, month, day] = this.shipDateNote.split("-");
    const ship_date_note = `${day}/${month}/${year}`;

    this.telecomService
      .updateShippingInfo({
        ship_date_note: ship_date_note,
        ship_status: 1,
        task_id: this.item.id,
      })
      .subscribe(
        (res) => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.modalClose();
        },
        (err) => {
          this.alertService.showMess(err);
        }
      );
  }
}
