import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderLtgService } from 'app/auth/service';
import { SmsService } from 'app/auth/service/sms.service';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
dayjs.locale('vi')

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public total: number;
  public page: number = 1;
  public pageSize: number = 20;
  public sumSms: number;
  public listTelco: any;
  public searchForm = {
    status: '',
    daterange: '',
    page: '',
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  submittedExport = false;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private orderLtgService: OrderLtgService
  ) {
    this.dateRange = null;
    this.activedRoute.queryParams.subscribe(params => {
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.daterange = params['daterange'] && params['daterange'] != undefined ? params['daterange'] : '';
      this.getData();
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Đơn giao vật tư LTG',
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
            name: 'Đơn giao vật tư LTG',
            isLink: false
          }
        ]
      }
    };

  }


  onSubmitSearch(): void {
    console.log(this.dateRange);
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? this.dateRange.startDate.toISOString().slice(0, 10) + '|' + this.dateRange.endDate.toISOString().slice(0, 10) : '';
    this.searchForm.daterange = daterangeString;
    console.log(this.searchForm);
    this.router.navigate(['/order-ltg'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/order-ltg'], { queryParams: this.searchForm })
  }

  showStatusText(status) {
    if (status == 1) {
      return '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>';
    } else if (status == -1) {
      return '<span class="badge badge-pill badge-light-warning mr-1">Hủy</span>';
    }
    else if (status == 2) {
      return '<span class="badge badge-pill badge-light-warning mr-1">ND đã duyệt</span>';
    } else if (status == 0) {
      return '<span class="badge badge-pill badge-light-success mr-1">Đang chờ</span>';
    } else
      return status;
  }

  getData() {
    this.sectionBlockUI.start();
    this.orderLtgService.findAll(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize
      this.sectionBlockUI.stop();
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }
}