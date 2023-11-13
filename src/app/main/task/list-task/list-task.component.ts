import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'app/auth/service/task.service';
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

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : '';
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

  modalOpen(modal, id) {
    this.taskService.getTransWebhook(id).subscribe(res => {
      this.task = res.data.task;
      this.wh = res.data.wh;
      this.trans = res.data.trans;

      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    })
  }

  modalClose() {
    this.modalRef.close();
  }

  checkGatewayTransaction(item) {
    let message = "Không xác định"
    if (item.service_code == "AIRTIME_TOPUP") {
      let dto = {
        Account: `AIRTIME_TOPUP_${item.merchant_id}`,
        TransactionId: 128193
      }
      this.taskService.checkGatewayTransaction(dto).subscribe(res => {
        if(res.status == 1)
          this.alertService.showMess(JSON.stringify(res), 20000)
        else{
          this.alertService.showError(JSON.stringify(res), 20000)
        }
      }, error => {
        this.alertService.showError(error, 20000)
      })

    } else if (item.service_code == "CASH") {
      message = "Hình thức thu tiền mặt"
    }
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
