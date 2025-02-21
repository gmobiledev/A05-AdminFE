import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-new-document-information",
  templateUrl: "./new-document-information.component.html",
  styleUrls: ["./new-document-information.component.scss"],
})
export class NewDocumentInformationComponent implements OnInit {
  @Input() dataText: any;
  @Input() item: any;
  @Input() dataImages: any;
    dataNewText;
  viewImage;
  public modalRef: any;
    
  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.dataNewText = this.dataText?.newInfo;
  }

  onViewImage(modal, imageBase64) {
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
