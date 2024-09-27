import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-customer-information',
  templateUrl: './new-customer-information.component.html',
  styleUrls: ['./new-customer-information.component.scss']
})
export class NewCustomerInformationComponent implements OnInit {
  @Input() dataText: any;
  @Input() dataImages: any;
  dataNewText;
  public viewImage;
  public modalRef: any;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
      this.dataNewText = this.dataText?.compare_info;
  }
  onViewImage(modal, type, mobile = null) {
    if (type == 'cccd_front_compare') {
      this.viewImage = 'data:image/png;base64,' + this.dataImages?.compare_info?.identification_front_file;
    }
    if (type == 'cccd_back_compare') {
      this.viewImage = 'data:image/png;base64,' + this.dataImages?.compare_info?.identification_back_file;
    }
    if (type == 'selfie_compare') {
      this.viewImage = 'data:image/png;base64,' + this.dataImages?.compare_info?.identification_selfie_file;
    }

    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
    });
  }
}
