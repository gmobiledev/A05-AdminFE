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
    if (
      this.dataOldText.customer_type == this.customerType.ORGANIZATION &&
      (this.item.action == this.listTaskAction.change_user_info.value ||
        this.item.action ==
          this.listTaskAction.app_request_change_user_info.value)
    ) {
      const representative_info = this.dataOldText?.representative_info;
      const people = this.dataOldText?.people;
      this.dataOldText.people = representative_info;
      this.dataOldText.representative_info = people;
    }
  }

  onCloseModalImage() {
    this.viewImage = null;
    this.modalRef.close();
  }

  onViewImage(modal, type, imageBase64) {
    this.viewImage = "data:image/png;base64," + imageBase64;
    
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "xl",
    });
  }
}
