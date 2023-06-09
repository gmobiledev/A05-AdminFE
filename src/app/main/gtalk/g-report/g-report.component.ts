import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/auth/service/admin.service';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { SUB_ACTION, TaskAction, TaskTelecomStatus } from 'app/utils/constants';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
dayjs.locale('vi')

@Component({
  selector: 'app-g-report',
  templateUrl: './g-report.component.html',
  styleUrls: ['./g-report.component.scss']
})
export class GReportComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public total: number;
  public page: number = 1;
  public pageSize: number;
  public sumSms: number;
  public listTelco: any;
  public sumAmount: any;
  public searchForm = {
    gateway: '',
    mobile: '',
    trans_id: '',
    status: '',
    daterange: '',
    page: '',
    type: ''
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
    private gtalkService: GtalkService
  ) {
    this.dateRange = null;
    this.activedRoute.queryParams.subscribe(params => {
      this.searchForm.gateway = params['gateway'] && params['gateway'] != undefined ? params['gateway'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';
      this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : 1;
      this.searchForm.type = params['type'] && params['type'] != undefined ? params['type'] : '';
      this.searchForm.daterange = params['daterange'] && params['daterange'] != undefined ? params['daterange'] : '';
      this.getData();
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Báo cáo',
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
            name: 'Báo cáo',
            isLink: false
          }
        ]
      }
    };

  }

  showLoaiText(item) {
    let text = '';
    if(item.action == TaskAction.TOPUP) {
      text = 'Nạp tiền'
    } else if (item.action == TaskAction.ORDER_NUMBER && !item.sub_action) {
      text = 'Mua mới'
    } else if (item.action == TaskAction.ORDER_NUMBER && item.sub_action == SUB_ACTION.TRA_SAU_SANG_TRA_TRUOC) {
      text = 'Chuyển 2G trả sau sang Gsim'
    } else if (item.action == TaskAction.ORDER_NUMBER && item.sub_action == SUB_ACTION.TRA_TRUOC) {
      text = 'Chuyển 2G trả trước sang Gsim'
    }
    return text;
  }


  onSubmitSearch(): void {
    console.log(this.dateRange);
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? this.dateRange.startDate.toISOString().slice(0, 10) + '|' + this.dateRange.endDate.toISOString().slice(0, 10) : '';
    this.searchForm.daterange = daterangeString;
    console.log(this.searchForm);
    this.router.navigate(['/gtalk/report'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gtalk/report'], { queryParams: this.searchForm });
  }

  getData() {
    this.sectionBlockUI.start();

    this.gtalkService.reportTask(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data;
      this.sumAmount = 0;
      for(const item of this.list) {
        this.sumAmount += parseInt(item.total);
      }
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }
}
