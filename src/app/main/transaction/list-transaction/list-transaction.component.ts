import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'app/auth/service/task.service';
import { TransactionServivce } from 'app/auth/service/transaction.service';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
dayjs.locale('vi')

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {
  
  public contentHeader: any;
  public list: any;
  public listTransType: any;
  public total: number;
  public page: number = 1;
  public pageSize: number;
  public payment_gateways = [
    {value: "GPAY", code: "GPAY"},
    {value: "G99", code: "G99"},
    {value: "VIETINBANK", code: "ICB"},
  ]
  public searchForm = {
    user: '',
    status: '',
    trans_type: '',
    gateway: '',
    date_range: '',
    trans_id: '',
    page: 1,
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],    
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public task;
  public trans;
  public wh;

  public modalRef: any;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private taskService: TaskService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionServivce
  ) {
    this.activedRoute.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.trans_type = params['trans_type'] && params['trans_type'] != undefined ? params['trans_type'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.gateway = params['gateway'] && params['gateway'] != undefined ? params['gateway'] : '';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;

      this.getData();
    })
   }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách giao dịch',
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
            name: 'Danh sách giao dịch',
            isLink: false
          }
        ]
      }
    };    
  }

  onSubmitSearch(): void {
    console.log(this.dateRange);
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate ?
    this.dateRange.startDate.toISOString().slice(0,10) + '|' + this.dateRange.endDate.toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    console.log(this.searchForm);
    this.router.navigate(['/transaction'], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/transaction'], { queryParams: this.searchForm});
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

  getData() {
    this.sectionBlockUI.start();
    this.transactionService.getAllTransType().subscribe(res => {
      this.listTransType = res.data.reduce(function(map, obj) {
        map[obj.code] = obj.desc;
        return map;
    }, {});;
    })
    this.transactionService.getAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

  onSubmitExportExcel() {
    console.log("onSubmitExportExcel")
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    this.transactionService.exportExcel(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Xuất báo cáo";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

}
