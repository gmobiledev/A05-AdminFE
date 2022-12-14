import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SmsService } from 'app/auth/service/sms.service';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
dayjs.locale('vi')

@Component({
  selector: 'app-list-sms',
  templateUrl: './list-sms.component.html',
  styleUrls: ['./list-sms.component.scss']
})
export class ListSmsComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public total: number;
  public page: number = 1;
  public pageSize: number;
  public sumSms: number;
  public listTelco: any;
  public searchForm = {
    telco: '',
    mobile: '',
    trans_id: '',
    status: '',
    daterange: '',
    page: ''
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
    private smsService: SmsService
  ) { 
    this.dateRange = null;
    this.activedRoute.queryParams.subscribe(params => {
      this.searchForm.telco = params['telco'] && params['telco'] != undefined ? params['telco'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';
      this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.daterange = params['daterange'] && params['daterange'] != undefined ? params['daterange'] : ''; 
      this.getData();           
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Sms log',
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
            name: 'Sms log',
            isLink: false
          }
        ]
      }
    };
   
  }
  

  onSubmitSearch(): void {
    console.log(this.dateRange);
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? this.dateRange.startDate.toISOString().slice(0,10) + '|' + this.dateRange.endDate.toISOString().slice(0,10) : '';
    this.searchForm.daterange = daterangeString;
    console.log(this.searchForm);
    this.router.navigate(['/sms-log'], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/sms-log'], { queryParams: this.searchForm});
  }

  showStatusText(status) {
    return status == 1 ? '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>' : '<span class="badge badge-pill badge-light-warning mr-1">Thất bại</span>'
  }

  getData() {
    this.sectionBlockUI.start();
    this.smsService.getAllTelco().subscribe(res => {
      this.listTelco = res.data.reduce(function(map, obj) {
        const value = JSON.parse(obj.meta_value);
        map[value.code] = value.label;
        return map;
    }, {});;
    })
    this.smsService.getAllLog(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
      this.sumSms = res.data.sum_sms;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}
