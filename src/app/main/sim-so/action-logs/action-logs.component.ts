import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { TelecomService } from 'app/auth/service/telecom.service';
@Component({
  selector: 'app-action-logs',
  templateUrl: './action-logs.component.html',
  styleUrls: ['./action-logs.component.scss']
})
export class ActionLogsComponent implements OnInit {
  public list: any;
  public total: any;
  public actionlogs: any = {
    id: '',
    detail
    : '',
    user: ''

  }
  productListAll:any;
  constructor(
     private telecomService: TelecomService
 ) {
 }
  public contentHeader: any = {
    headerTitle: 'Nhật ký hoạt động',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Action-logs',
          isLink: true,
          link: '/'
        },
        {
          name: 'Nhật ký hoạt động',
          isLink: false
        }
      ]
    }
  };
  onSubmitSearch() {
    console.log(this.actionlogs);
    this.telecomService.actionLogs(this.actionlogs).subscribe(res => {
      this.list = res.data.items;
      this.total= res.data.count;
    })
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  
  ngOnInit(): void {
    this.onSubmitSearch();
  }
  getData(): void {
    
  }
}
