import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'app/auth/service/task.service';
import { ObjectLocalStorage, ServiceCode, TaskStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListTaskComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalItems: number;
  public summaryTask: any;
  public listService: any;
  public page: any;
  public total: any;
  public pageSize: any;
  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    trans_id: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
    page: 1,
    service_code: '',
    page_size: 20
  }
  public isViewFile: boolean = false;
  public urlFile: any;
  public task;
  public trans;
  public wh;

  public modalRef: any;
  public currentService;
  isSingleService;
  public selectedItem;
  public taskStatus = TaskStatus;
  public dataApprove = {
    brand: '',
    id: ''
  }
  listCurrentRoles;
  listCurrentAction;
  public listFiles: any;
  tableColumnName = {
    amount: 'Số tiền'
  }
  currency = 'VND'
  ServiceCode = ServiceCode;
  listSerial;
  basicSelectedOption =  25;

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const data = this.route.snapshot.data;  
    this.currentService = data && data.service ? data.service : '';
    if(this.currentService == ServiceCode.ADD_DATA_BALANCE) {
      this.tableColumnName.amount = 'Số GB';
      this.currency = '';
    } else if([ServiceCode.SIM_KITTING, ServiceCode.SIM_PROFILE, ServiceCode.SIM_REGISTER].includes(this.currentService)) {
      this.tableColumnName.amount = 'Số lượng';
      this.currency = '';
    }
    this.isSingleService = data && data.single_service ? true : false;

    this.route.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : this.currentService;
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.is_customer_sign = params['is_customer_sign'] && params['is_customer_sign'] != undefined ? params['is_customer_sign'] : '';
      this.searchForm.is_guarantee_sign = params['is_guarantee_sign'] && params['is_guarantee_sign'] != undefined ? params['is_guarantee_sign'] : '';
      this.searchForm.is_bank_sign = params['is_bank_sign'] && params['is_bank_sign'] != undefined ? params['is_bank_sign'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate([window.location.pathname], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate([window.location.pathname], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.listCurrentAction = user.actions;
    this.listCurrentRoles = user.roles;
    
    this.contentHeader = {
      headerTitle: 'Danh sách task',
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
            name: 'Danh sách task',
            isLink: false
          }
        ]
      }
    };
    if (this.searchForm.service_code == 'BANK_LOAN_PVCOMBANK') {
      this.contentHeader.headerTitle = "Danh sách khoản vay";
      this.contentHeader.breadcrumb.links[1].name = "Danh sách khoản vay";
    }
  }

  modalOpen(modal, item = null) {
    this.selectedItem = item;
    if(item) {      
      this.taskService.getTransWebhook(item.id).subscribe(res => {
        this.task = res.data.task;
        this.wh = res.data.wh;
        this.trans = res.data.trans;
        if([ServiceCode.SIM_PROFILE].includes(this.currentService)) {
          this.listSerial = res.data.task.details.filter(x => x.attribute == 'serial');
        } else if(this.currentService == ServiceCode.SIM_KITTING || this.currentService == ServiceCode.SIM_REGISTER) {
          this.listSerial = res.data.task.msisdns;
        }
  
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
    
  }

  modalClose() {
    this.modalRef.close();
  }

  getJSONDetail(item, key) {
    const r =  item.detail ? JSON.parse(item.detail) : null;
    if(!r) {
      return null;
    }
    return r[key]
  }

  filterList(event) {

  }

  checkGatewayTransaction(item) {
    let message = "Không xác định"
    let self = this;
    if (item.service_code == "AIRTIME_TOPUP") {
      let dto = {
        Account: `AIRTIME_TOPUP_${item.merchant_id}`,
        TransactionId: item.id
      }
      this.taskService.checkGatewayTransaction(dto).subscribe(res => {
        if (res.status == 1)
          self.alertService.showMess(JSON.stringify(res), 20000)
        else {
          self.alertService.showError(JSON.stringify(res), 20000)
        }
      }, error => {
        self.alertService.showError(error, 20000)
      })

    } else if (item.service_code == "CASH") {
      message = "Hình thức thu tiền mặt"
      self.alertService.showMess(message, 20000)
    } else {
      self.alertService.showMess(message, 20000)
    }
  }

  async onApproveTask() {
    if(this.selectedItem.service_code == ServiceCode.SIM_PROFILE && !this.dataApprove.brand) {
      this.alertService.showMess("Vui lòng chọn nhà mạng");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng duyệt đơn?")).value) {
      if(this.selectedItem.service_code == ServiceCode.SIM_PROFILE) {
        this.approveSimProfileTask();
      } else if(this.selectedItem.service_code == ServiceCode.SIM_KITTING) {
        this.approveSimKitting();
      }  else if(this.selectedItem.service_code == ServiceCode.SIM_REGISTER) {
        this.approveSimRegister();
      }
    }    
  }

  approveSimProfileTask() {
    
    let dataPost = {
      id: this.selectedItem.id,
      brand: this.dataApprove.brand
    }
    this.taskService.approveTask(dataPost).subscribe(res => {
      this.alertService.showSuccess(res.message);
      this.getData();
      this.modalClose();
    }, error => {
      this.alertService.showMess(error);
    })
  }

  approveSimKitting() {
    
    let dataPost = {
      id: this.selectedItem.id,
    }
    this.taskService.approveTaskSimKitting(dataPost).subscribe(res => {
      this.alertService.showSuccess(res.message);
      this.getData();
      this.modalClose();
    }, error => {
      this.alertService.showMess(error);
    })
  }

  approveSimRegister() {
    
    let dataPost = {
      id: this.selectedItem.id,
    }
    this.taskService.approveTaskSimRegister(dataPost).subscribe(res => {
      this.alertService.showSuccess(res.message);
      this.getData();
      this.modalClose();
    }, error => {
      this.alertService.showMess(error);
    })
  }

  onViewDetail(modal, item) {
    this.selectedItem = item;
    this.taskService.getFileMerchantAttach(item.id).subscribe(res => {
      if (res.status && res.data) {
        this.listFiles = res.data;
      }
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }, error => {

    })
  }

  async onUpdateStatus(item, status) {
    let data = {
      id: item.id,
      status: status,
      note: ''
    }
    if (status == 99 || (status == 10 && this.checkAction("ACCOUNTING")) || status == 1) {
      let titleS;
      if (status == 99) {
        titleS = 'Từ chối yêu cầu, gửi lý do cho đại lý'
      }
      if (status == 1) {
        titleS = 'Xác nhận đã nhận được tiền, lưu ghi chú'
      }

      Swal.fire({
        title: titleS,
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Gửi',
        showLoaderOnConfirm: true,
        preConfirm: (note) => {
          if (!note || note == '') {
            Swal.showValidationMessage(
              "Vui lòng nhập nội dung"
            )
            return;
          }
          data.note = note;
          this.taskService.departmentUpdateTaskStatus(data).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              this.getData();
              //this.updateStatus.emit({updated: true});
              // this.alertService.showSuccess('Thành công');
              return;
            }
            this.getData();
            this.alertService.showSuccess(res.message);
          }, error => {
            Swal.showValidationMessage(
              error
            )
          });

        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {       
          //this.updateStatus.emit({updated: true});
          // this.alertService.showSuccess('Thành công');
        }
      })
    } else {
      let confirmMessage = "";
      if (status == 20) {
        confirmMessage = 'Xác nhận duyệt yêu cầu';
        data.note = "Xác nhận"
      }

      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.taskService.departmentUpdateTaskStatus(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.modalClose();
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
    }
  }

  getData(): void {
    this.taskService.getAllService().subscribe(res => {
      this.listService = res.data.reduce(function (map, obj) {
        map[obj.code] = obj.desc;
        return map;
      }, {});;
    })
    if(this.isSingleService) {
      this.taskService.getTaskByServiceCode(this.currentService, this.searchForm).subscribe(res => {
        this.list = res.data.items;
        this.totalItems = res.data.count;
      }, error => {
        console.log("ERRRR");
        console.log(error);
      })
    } else {
      this.taskService.getAll(this.searchForm).subscribe(res => {
        this.list = res.data.items;
        this.totalItems = res.data.count;
      }, error => {
        console.log("ERRRR");
        console.log(error);
      })
    }
    
  }
  
  checkRole(item) {
    return this.listCurrentRoles.find(itemX => itemX.item_name.includes(item))
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

}
