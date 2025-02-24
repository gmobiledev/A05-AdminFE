import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-old-document-information",
  templateUrl: "./old-document-information.component.html",
  styleUrls: ["./old-document-information.component.scss"],
})
export class OldDocumentInformationComponent implements OnInit {
  @Input() dataText: any;
  @Input() item: any;
  @Input() dataImages: any;
  dataOldText;
  viewImage;
  public modalRef: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.dataOldText = this.dataText?.oldInfo;
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
