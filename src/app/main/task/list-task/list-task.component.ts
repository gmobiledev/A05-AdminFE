import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'app/auth/service/task.service';
import { ServiceCode, TaskStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss']
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
  public currentTask;
  public taskStatus = TaskStatus;
  public dataApprove = {
    brand: '',
    id: ''
  }

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const data = this.route.snapshot.data;  
    this.currentService = data && data.service ? data.service : '';

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
    this.router.navigate(['/task'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/task'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
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
    this.currentTask = item;
    if(item && item.webhook_id) {      
      this.taskService.getTransWebhook(item.id).subscribe(res => {
        this.task = res.data.task;
        this.wh = res.data.wh;
        this.trans = res.data.trans;
  
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
    if(this.currentTask.service_code == ServiceCode.SIM_PROFILE && !this.dataApprove.brand) {
      this.alertService.showMess("Vui lòng chọn nhà mạng");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng duyệt đơn?")).value) {
      if(this.currentTask.service_code == ServiceCode.SIM_PROFILE) {
        this.approveSimProfileTask();
      }
    }
    
  }

  approveSimProfileTask() {
    
    let dataPost = {
      id: this.currentTask.id,
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

  getData(): void {
    this.taskService.getAllService().subscribe(res => {
      this.listService = res.data.reduce(function (map, obj) {
        map[obj.code] = obj.desc;
        return map;
      }, {});;
    })
    this.taskService.getAll(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
