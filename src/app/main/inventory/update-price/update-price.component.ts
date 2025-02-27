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
    name: "",
    code: "",
    status: "",
    page_size: 20,
    page: 1,
  };
  selectView;
  dataProducts;
  public totalPage: number;
  listdata;
  public totalItems: number;
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @ViewChild("modalItemCreate") modalItemCreate: ElementRef;
  @ViewChild("modalItemView") modalItemView: ElementRef;
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
    this.getData();
  }

  getData() {
    this.itemBlockUI.start();
    this.telecomService.getDataBatchs(this.searchForm).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.listdata = res.data.data;
          this.totalItems = res.data.totalRecords;
          this.totalPage = res.data.totalRecords;
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

  viewDetailPriceUpdate(id, name:string){
    this.selectView = name;
    this.telecomService.getDataDetailPriceUpdate(id).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.dataProducts = res.data.data;
          this.modalOpen(this.modalItemView);
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

  modalClose() {
    this.modalRef.close();
    this.getData();
  }

  async modalOpen(modal, item = null) {
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
    this.getData();
  }

  onSubmitSearch() {
    console.log('searchForm', this.searchForm);
    
    this.getData();
  }

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
