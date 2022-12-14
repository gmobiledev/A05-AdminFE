import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderLtgService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-view-loan-bank',
  templateUrl: './view-loan-bank.component.html',
  styleUrls: ['./view-loan-bank.component.scss']
})
export class ViewLoanBankComponent implements OnInit {

  public id: any;
  public contract: any;
  public task: any;
  public taskDetail: any;
  public itemKyhanLaisuat: any;
  public itemBankname: any;
  public people: any;
  public files: any;
  public titleModal: any;
  public listOrder: any;
  public modalRef: any;
  public modalContractRef: any;
  public page: number = 1;
  public pageSize: number = 20;

  public dataUpdate = {
    status: '',
    note: '',
    id: ''
  };
  public submitted = false;

  public contentHeader: any =  {
    headerTitle: 'Chi tiết khoản vay',
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
          name: 'Danh sách khoản vay',
          isLink: true,
          link: '/loan-bank'
        },
        {
          name: 'Chi tiết khoản vay',
          isLink: false
        }
      ]
    }
  };

  constructor(
    private modalService: NgbModal,
    private activedRoute: ActivatedRoute,
    private taskService: TaskService,  
    private orderService: OrderLtgService,
    private _alertService: SweetAlertService,  
  ) { 
    this.id = this.activedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getData();    
  }

  onSubmitUpdateStatus() {
    this.submitted = true;
    this.taskService.updateStatus(this.dataUpdate).subscribe(res => {
      if(!res.status) {
        this._alertService.showError(res.message); 
        this.submitted = false;
        return;
      }
      this._alertService.showSuccess(res.message);
      this.getData();
      this.modalClose();
    })
  }

  onSubmitUpdateStatusOrder() {
    this.submitted = true;
    this.orderService.updateStatus(this.dataUpdate).subscribe(res => {
      if(!res.status) {
        this._alertService.showError(res.message); 
        this.submitted = false;
        return;
      }
      this._alertService.showSuccess(res.message);
      this.getData();
      this.modalClose();
    })
  }

  modalOpenContract(modal) {
    this.modalContractRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }
  modalContractClose() {
    this.modalContractRef.close();
  }
  modalOpen(modal, status) {
    if(status == 0) {
      this.titleModal = "Bạn không duyệt khoản vay? Nhập ghi chú lý do";
    } if(status == 3) {
      this.titleModal = "Bạn đồng ý duyệt khoản vay này?";
    } if (status == 5) {
      this.titleModal = "Bạn đồng ý giải ngân khoản vay này?"
    }
    this.dataUpdate.status = status;
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }
  modalOpenOrder(modal, item, status) {
    if (status == 5) {
      this.titleModal = "Bạn đồng ý giải ngân cho đơn hàng này?"
    }
    this.dataUpdate.status = status;
    this.dataUpdate.id = item.id;
    this.dataUpdate.note = "";
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.dataUpdate.status = '';
    this.dataUpdate.note = '';
    this.modalRef.close();
  }

  getData() {
    this.taskService.getById(this.id).subscribe(res => {
      this.contract = res.data.contract_info.contract;
      this.people = res.data.contract_info.people;
      this.files = res.data.contract_info.files;
      this.taskDetail = res.data.task_detail;
      this.itemKyhanLaisuat = this.taskDetail.find(item => item.attribute.includes("month"));
      this.itemBankname = this.taskDetail.find(item => item.attribute.includes("bank"));
      this.task = res.data.task;

      this.dataUpdate.id = this.task.id;
      this.getListOrder({contract_code: this.task.contract_code, page: this.page});
    })
  }

  getListOrder(params) {
    this.orderService.findAll(params).subscribe(res => {
      this.listOrder = res.data.items;
    })
  }

  loadPageOrder(page) {
    this.page = page;
    this.getListOrder({contract_code: this.task.contract_code, page: this.page})
  }

  showStatusText(status) {
    if (status == 1) {
      return '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>';
    } else if (status == -1) {
      return '<span class="badge badge-pill badge-light-warning mr-1">Hủy</span>';
    }
    else if (status == 2) {
      return '<span class="badge badge-pill badge-light-success mr-1">Ngân hàng đã duyệt</span>';
    } else if (status == 3) {
      return '<span class="badge badge-pill badge-light-success mr-1">Ngân hàng đang giải ngân</span>';
    } 
    else if (status == 4) {
      return '<span class="badge badge-pill badge-light-success mr-1">Ngân hàng đã giải ngân</span>';
    } else if (status == 5) {
      return '<span class="badge badge-pill badge-light-success mr-1">Chờ giao hàng</span>';
    } 
    else if (status == 0) {
      return '<span class="badge badge-pill badge-light-success mr-1">Đang chờ</span>';
    } else
      return status;
  }

}
