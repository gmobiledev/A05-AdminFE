import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InventoryService } from 'app/auth/service/inventory.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-doanh-thu',
  templateUrl: './doanh-thu.component.html',
  styleUrls: ['./doanh-thu.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  public searchForm = {
    page: 1,
    page_size: 15,
    startDate: '',
    endDate: '',
    sell_channel_id: ''
  }
  totalItems;
  listChannel;

  constructor(
    private readonly telecomService: TelecomService,
    private readonly alertService: SweetAlertService,
    private readonly inventoryService: InventoryService
  ) { }


  ngOnInit(): void {
    this.getData();
    this.getChannel();
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.getData();
  }

  getData() {    
    this.sectionBlockUI.start();
    this.telecomService.getSimReport(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
      this.alertService.showMess(error);      
    });    
  }

  getChannel() {
    this.inventoryService.getMyChannel(null).subscribe(res => {
      this.listChannel = res.data.items;
    })
  }

}
