import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/auth/service/inventory.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-doanh-thu',
  templateUrl: './doanh-thu.component.html',
  styleUrls: ['./doanh-thu.component.scss']
})
export class DoanhThuComponent implements OnInit {
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Báo cáo doanh thu',
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
          name: 'Báo cáo doanh thu',
          isLink: false
        }
      ]
    }
  };
  list = [];
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
    this.telecomService.getSimReport(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    })
  }

}
