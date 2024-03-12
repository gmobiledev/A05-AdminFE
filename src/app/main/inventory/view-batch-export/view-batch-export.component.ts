import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BatchStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-view-batch-export',
  templateUrl: './view-batch-export.component.html',
  styleUrls: ['./view-batch-export.component.scss']
})
export class ViewBatchExportComponent implements OnInit {

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

  modalRef;
  batchStatus = BatchStatus;
  listCurrentAction;
  currentUser;
  id;
  data;
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly alertService: SweetAlertService
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
    })
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
      if(status == this.batchStatus.APPORVED_BY_ACCOUNTANT) {
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
      if(status == this.batchStatus.APPORVED) {
        this.inventoryService.vanphongDuyet(data).subscribe(res => {
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
    } else {

    }
    
  }

}
