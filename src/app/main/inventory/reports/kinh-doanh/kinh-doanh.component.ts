import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-kinh-doanh',
  templateUrl: './kinh-doanh.component.html',
  styleUrls: ['./kinh-doanh.component.scss']
})
export class KinhDoanhComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Báo cáo tiêu dùng',
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
          name: 'Báo cáo tiêu dùng',
          isLink: false
        }
      ]
    }
  };
  public list = [];
  searchForm = {
    page: 1,
    page_size: 15
  }
  totalItems;

  constructor(
    private readonly telecomService: TelecomService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.getData();
  }

  getData() {
    this.telecomService.getBussinessReport(null).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    })
  }

}
