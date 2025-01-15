import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { InventoryService } from "app/auth/service/inventory.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TelecomService } from "app/auth/service/telecom.service";
@Component({
  selector: "app-update-price",
  templateUrl: "./update-price.component.html",
  styleUrls: ["./update-price.component.scss"],
})
export class UpdatePriceComponent implements OnInit {
  public contentHeader: any;
  public searchForm = {
    id: "",
    name: "",
    code: "",
    desc: "",
    parent_id: "",
    business_id: "",
    type: "",
    status: "",
    admin_id: "",
    admin2_id: "",
    province_id: "",
    district_id: "",
    skip: 0,
    commune_id: "",
    address: "",
    attach_file_name: "",
    customer_id: "",
    user_sell_channels: "",
    quantity: "",
    page_size: 10,
    page: 1,
  };
  public totalPage: number;
  public list = [{code: 123123,
    name: 'ancs',
    desc: 'sdfsd',
    admin_id: 12312,
    status: 0
  }];
  public totalItems: number;
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @ViewChild("modalItemCreate") modalItemCreate: ElementRef;
  public modalRef: any;

  constructor(
    private inventoryService: InventoryService,
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Danh sách phiếu cập nhật giá bán",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Danh sách phiếu cập nhật giá bán",
            isLink: false,
          },
        ],
      },
    };
  }

  modalClose() {
    this.modalRef.close();
  }

  async modalOpen(modal, item = null) {
    // this.itemBlockUI.start();

    // this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  loadPage(page): void {
    this.searchForm.page = page;
    this.onSubmitSearch();
  }

  onSubmitSearch() {}

  onSubmitExportExcelReport() {
    this.inventoryService
      .exportExcelReport(this.searchForm)
      .subscribe((res) => {
        var newBlob = new Blob([res.body], { type: res.body.type });
        let url = window.URL.createObjectURL(newBlob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = "Báo cáo kho sim";
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }
}
