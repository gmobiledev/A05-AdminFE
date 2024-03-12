import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { MsisdnStatus, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import JSZip from 'jszip';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thong-tin-thue-bao',
  templateUrl: './thong-tin-thue-bao.component.html',
  styleUrls: ['./thong-tin-thue-bao.component.scss']
})
export class ThongTinThueBaoComponent implements OnInit {
  public data: any;
  public viewImage;
  public modalRef: any;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @Input() view;
  @Input() msisdn: any
  @Input() service: any;

    constructor(
    private modalService: NgbModal,
    private telecomService: TelecomService,
    private gtalkService: GtalkService,
    private adminService: AdminService,
    private alertService: SweetAlertService
  ) {
  }

  ngOnInit(): void {
    this.getThongTinThueBao();
  }

  onViewImage(modal, type, mobile = null) {
    if (type == 'cccd_front') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64Front
    }
    if (type == 'cccd_back') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64Back
    }
    if (type == 'selfie') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64Selfie
    }
    if (type == 'signature') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64Signature
    }
    if (type == 'cccd_front_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64FrontCompare
    }
    if (type == 'cccd_back_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64BackCompare
    }
    if (type == 'selfie_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64SelfieCompare
    }
    if (type == 'signature_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64SignatureCompare
    }
    if (type == 'sim') {
      this.viewImage = 'data:image/png;base64,' + this.data?.msisdn?.base64SimFile[mobile]
    }
    if (type == 'sim_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data?.msisdn?.base64SimFile[mobile]
    }

    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
    });
  }

  onCloseModalImage() {
    this.viewImage = null;
    this.modalRef.close();
  }

  getThongTinThueBao(){
    if(this.service && this.service == 'telecom') {
      this.telecomService.getMisisdnInfo(this.msisdn.id).subscribe(res => {
        this.data = res.data;
      })
    } else if (this.service && this.service == 'gtalk') {
      this.gtalkService.getMisisdnInfo(this.msisdn.id).subscribe(res => {
        this.data = res.data;
      })
    }
    
  }

}
