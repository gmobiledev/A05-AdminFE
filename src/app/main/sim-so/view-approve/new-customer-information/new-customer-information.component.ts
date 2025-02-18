import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomerType, TaskTelecom } from "app/utils/constants";

@Component({
  selector: "app-new-customer-information",
  templateUrl: "./new-customer-information.component.html",
  styleUrls: ["./new-customer-information.component.scss"],
})
export class NewCustomerInformationComponent implements OnInit {
  @Input() dataText: any;
  @Input() item: any;
  @Input() dataImages: any;
  dataNewText;
  public viewImage;
  public modalRef: any;
  customerType = CustomerType;
  public listTaskAction = TaskTelecom.ACTION;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dataNewText = this.dataText?.compare_info;
  }

  onViewImage(modal, type, imageBase64) {
      this.viewImage ="data:image/png;base64," + imageBase64;

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
