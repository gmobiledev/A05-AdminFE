import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/auth/service/inventory.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-kinh-doanh',
  templateUrl: './kinh-doanh.component.html',
  styleUrls: ['./kinh-doanh.component.scss']
})
export class KinhDoanhComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Báo cáo tổng hợp',
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
          name: 'Báo cáo tổng hợp',
          isLink: false
        }
      ]
    }
  };
  public list = [];
  searchForm = {
    page: 1,
    page_size: 15,
    reference_code: ''
  }
  totalItems;

  constructor(
    private readonly telecomService: TelecomService,
    private readonly inventoryServie: InventoryService,
    private readonly alertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.getData();
  }

  getData() {
    this.sectionBlockUI.start();
    this.inventoryServie.summaryReport(null).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
      this.alertService.showMess(error);
    })
  }

}
