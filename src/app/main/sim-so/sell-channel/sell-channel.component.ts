import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-sell-channel',
  templateUrl: './sell-channel.component.html',
  styleUrls: ['./sell-channel.component.scss']
})
export class SellChannelComponent implements OnInit {

  public contentHeader: any =  {
    headerTitle: 'Kho bán',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Home',
          isLink: true,
          link: '/'
        },
        {
          name: 'Kho bán',
          isLink: false
        }
      ]
    }
  };
  public list: any;

  public modalRef: any;

  public isCreate: boolean = false;
  public submitted: boolean = false;  
  public selectedId: number;
  public titleModal: string;

  constructor(
    private modalService: NgbModal,
    private telecomService: TelecomService
  ) { }

  modalOpen(modal, item = null) { 
    if(item) {
      this.titleModal = "Cập nhật";
      this.isCreate = false;
      this.selectedId = item.id;
      this.telecomService.packageDetail(item.id).subscribe(res => {        
        // this.formGroup.patchValue({
        //   name: res.data.name,
        //   code: res.data.code,
        //   price: res.data.price,
        //   short_desc: res.data.short_desc,
        //   desc: res.data.desc,
        //   telco: res.data.telco,        
        // });
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.titleModal = "Thêm mới";
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.telecomService.sellChannelList(null).subscribe(res => {
      // this.sectionBlockUI.stop();
      this.list = res.data.items;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      // this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}
