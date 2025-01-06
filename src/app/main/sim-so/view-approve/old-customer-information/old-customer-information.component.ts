import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomerType, TaskTelecom } from "app/utils/constants";

@Component({
  selector: "app-old-customer-information",
  templateUrl: "./old-customer-information.component.html",
  styleUrls: ["./old-customer-information.component.scss"],
})
export class OldCustomerInformationComponent implements OnInit {
  @Input() dataText: any;
  @Input() dataImages: any;
  @Input() item: any;
  dataOldText;
  public modalRef: any;
  public viewImage;
  customerType = CustomerType;
  public listTaskAction = TaskTelecom.ACTION;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.dataOldText = this.dataText?.customer;
    if (this.dataOldText.customer_type == this.customerType.ORGANIZATION && this.item.action == this.listTaskAction.change_user_info.value) {
      const representative_info = this.dataOldText?.representative_info;
      const people =  this.dataOldText?.people;
      this.dataOldText.people = representative_info;
      this.dataOldText.representative_info = people;
    }
  }

  onViewImage(modal, type, mobile = null) {
    if (type == "cccd_front") {
      this.viewImage =
        "data:image/png;base64," +
        this.dataImages?.customer?.people?.identification_front_file;
    }
    if (type == "cccd_back") {
      this.viewImage =
        "data:image/png;base64," +
        this.dataImages?.customer?.people?.identification_back_file;
    }
    if (type == "selfie") {
      this.viewImage =
        "data:image/png;base64," +
        this.dataImages?.customer?.people?.identification_selfie_file;
    }

    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "xl",
    });
  }
}
