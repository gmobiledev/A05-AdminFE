import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { TelecomService } from 'app/auth/service/telecom.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'app-action-logs',
  templateUrl: './action-logs.component.html',
  styleUrls: ['./action-logs.component.scss']
})
export class ActionLogsComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  public list: any;
  public totalItems: number;

  public searchForm: any = {
    id: '',
    detail: '',
    user_id: '',
    msisdn: '',
    page: 1,
    page_size: 20,
    date_range: '',
  }
  productListAll: any;
  constructor(
    private telecomService: TelecomService,
    private inventoryService: InventoryService,
    private router: Router,
    private activeRouted: ActivatedRoute
  ) {
    this.activeRouted.queryParams.subscribe(params => {
      this.searchForm.msisdn = params['msisdn'] && params['msisdn'] != undefined ? params['msisdn'] : '';
      this.searchForm.user_id = params['user_id'] && params['user_id'] != undefined ? params['user_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      this.onSubmitSearch();
    })
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
    this.sectionBlockUI.start();
    this.inventoryService.getActionlogs(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
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

  loadPage(page) {
    console.log(page);
    this.searchForm.page = page;
    this.router.navigate(['/inventory/action-logs'], { queryParams: this.searchForm });
  }

  ngOnInit(): void {
    this.onSubmitSearch();
  }


}
