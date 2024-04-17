import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-msisdn-single',
  templateUrl: './msisdn.component.html',
  styleUrls: ['./msisdn.component.scss']
})
export class MsisdnComponent implements OnInit {

  @ViewChild('modalItem') modalItem: ElementRef;
  
  searchForm = {
    mobile: ''
  }
  data;
  selectedItem;
  service;
  public modalRef: any;
  constructor(
    private readonly telecomService: TelecomService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  async modalOpen(modal, item = null) {
    // this.itemBlockUI.start();
    this.selectedItem = item;

    // this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  modalClose() {
    this.selectedItem = null;
    // this.getData();
    this.modalRef.close();
  }

  onSubmitSearch() {
    this.telecomService.getMsisdnInfo(this.searchForm.mobile).subscribe(res => {
      this.selectedItem = res.data;
      this.service = !['VNP', 'VMS', 'VNM'].includes(res.data.mno) ? 'gtalk' : 'telecom';
      this.modalOpen(this.modalItem, this.selectedItem);
    }, error => {

    })
  }
  

}
