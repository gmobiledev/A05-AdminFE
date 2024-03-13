import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-view-batch-export',
  templateUrl: './view-batch-export.component.html',
  styleUrls: ['./view-batch-export.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewBatchExportComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  
  public contentHeader = {
    headerTitle: 'Chi tiết phiếu',
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
          name: 'Danh sách phiếu xuất',
          isLink: true,
          link: '/inventory/batch'
        },
        {
          name: 'Chi tiết phiếu',
          isLink: false
        }
      ]
    }
  };

  modalRef: any;
  batchStatus = BatchStatus;
  listCurrentAction: any;
  currentUser: any;
  id: any;
  data: any;
  fromChannel: any;
  toChannel: any;
  tempList: any;
  listProducts: any;
  public basicSelectedOption: number = 10;
  dataApprove = {
    attached_file_name: '',
    attached_file_content: ''
  }

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly alertService: SweetAlertService,
    private readonly commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    this.inventoryService.findOneBatchExport(this.id).subscribe(res => {
      this.data = res.data;
      this.listProducts = res.data.products;
      this.tempList = res.data.products;
      if(res.data.channels) {
        this.fromChannel = res.data.channels.find(x => x.id == res.data.batch.channel_id);
        this.toChannel = res.data.channels.find(x => x.id == res.data.batch.to_channel_id);
      }
    })
  }

  filterList(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.listProducts = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

  onViewModalApprove(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.modalRef.close();
  }

  async onApprove(item, status, type) {
    let data = {
      batch_id: item.id,
      user_id: this.currentUser.id
    }
    if(type == 'ketoan') {
      if(status == this.batchStatus.APPROVED_BY_ACCOUNTANT) {
        this.inventoryService.ketoanDuyet(data).subscribe(res => {
          if(!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
          this.modalClose();
        },error => {
          this.alertService.showMess(error)
        })
      } else if (status == this.batchStatus.CANCEL_BY_ACCOUNTANT) {
        if ((await this.alertService.showConfirm('Bạn có chắc chắn từ chối yêu cầu này?')).value) {
          this.inventoryService.ketoanReject(data).subscribe(res => {
            if(!res.status) {
              this.alertService.showMess(res.message);
              return;
            }
            this.alertService.showSuccess(res.message);
            this.getData();
          },error => {
            this.alertService.showMess(error)
          })
        }      
      }
    } else if (type == 'vanphong') {
      if(status == this.batchStatus.APPROVED) {
        this.inventoryService.vanphongDuyet({...data, ...this.dataApprove}).subscribe(res => {
          if(!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
          this.modalClose();
        },error => {
          this.alertService.showMess(error)
        })
      } else if (status == this.batchStatus.CANCEL_BY_OFFICE) {
        if ((await this.alertService.showConfirm('Bạn có chắc chắn từ chối yêu cầu này?')).value) {
          this.inventoryService.vanPhongReject(data).subscribe(res => {
            if(!res.status) {
              this.alertService.showMess(res.message);
              return;
            }
            this.alertService.showSuccess(res.message);
            this.getData();
          },error => {
            this.alertService.showMess(error)
          })
        }
        
      }
    } else if(type == 'user') {
      let confirmMess = status == this.batchStatus.CANCEL_BY_USER ? 'Bạn có đồng ý từ chối yêu cầu này?' : 'Bạn có đồng ý duyệt yêu cầu này?';
      if ((await this.alertService.showConfirm(confirmMess)).value) {
        if (status == this.batchStatus.APPROVED) {
          this.inventoryService.userDuyet(data).subscribe(res => {
            if (!res.status) {
              this.alertService.showMess(res.message);
              return;
            }
            this.alertService.showSuccess(res.message);
            this.getData();
            this.modalClose();
          }, error => {
            this.alertService.showMess(error)
          })
        } else if (status == this.batchStatus.CANCEL_BY_USER) {
          this.inventoryService.userReject(data).subscribe(res => {
            if (!res.status) {
              this.alertService.showMess(res.message);
              return;
            }
            this.alertService.showSuccess(res.message);
            this.getData();
          }, error => {
            this.alertService.showMess(error)
          })
        }
      }
    } else {

    }
    
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataApprove.attached_file_name = event.target.files[0].name;
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataApprove.attached_file_content = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataApprove.attached_file_name = event.target.files[0].name;
        this.dataApprove.attached_file_content = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
    // if (event.target.files && event.target.files[0]) {
    //   let img = await this.commonService.resizeImage(event.target.files[0]);
    //   this.dataCreatePayment.file = (img+'').replace('data:image/png;base64,', '')
    // }
  }

}
