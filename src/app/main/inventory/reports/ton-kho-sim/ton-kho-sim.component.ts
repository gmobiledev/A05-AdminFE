import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-ton-kho-sim',
  templateUrl: './ton-kho-sim.component.html',
  styleUrls: ['./ton-kho-sim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TonKhoSimComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  public contentHeader = {
    headerTitle: 'Báo cáo tồn kho SIM',
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
          name: 'Báo cáo tồn kho SIM',
          isLink: false
        }
      ]
    }
  };

  searchForm = {
    channel_id: '',
    end_date: '',
    start_date: '',
  }
  sumItems = {
    begin_total: 0,
    exported: 0,
    imported: 0,
    total: 0
  }
  listChannel;
  list;
  constructor(
    private route: ActivatedRoute,
    private readonly inventoryService: InventoryService,
    private readonly commonService: CommonService
  ) {
    this.route.queryParams.subscribe(async params => {
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.searchForm.start_date = new Date(new Date().getTime() - tzoffset).toISOString().slice(0,10)
      this.searchForm.end_date = new Date(new Date().getTime() - tzoffset).toISOString().slice(0,10)
      await this.getChannel();
      this.getData();
    })
  }

  ngOnInit(): void {
  }

  getData() {
    this.sectionBlockUI.start();
    this.sumItems = {
      begin_total: 0,
      exported: 0,
      imported: 0,
      total: 0
    }
    const paramsSearch = {
      channel_id: this.searchForm.channel_id,
      start_date: this.searchForm.start_date ? this.searchForm.start_date + ' 00:00:00' : '',
      end_date: this.searchForm.end_date ? this.searchForm.end_date + ' 00:00:00' : '',
    }
    this.inventoryService.reportInventorySim(paramsSearch).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data;
      for(let item of this.list) {
        this.sumItems.begin_total += item.begin_total;
        this.sumItems.exported += item.exported;
        this.sumItems.imported += item.imported;
        this.sumItems.total += item.total;
      }
    }, error => {
      this.sectionBlockUI.stop();
    })
  }

  exportExcel() {
    const data = this.list.map(x => {
      return {
        "Mã hàng": x.product_code,
        "Tên hàng": x.product_name,
        "Số lượng đầu kỳ": x.begin_total,
        "Nhập kho": x.imported,
        "Xuất kho": x.exported,
        "Số lượng cuối kỳ": x.total
      }
    })
    this.commonService.exportExcel(data, `Tồn kho sim_${this.searchForm.start_date}_${this.searchForm.end_date}_.xlsx`)
  }

  async getChannel() {
    const res = await this.inventoryService.getMyChannel(null).toPromise();
    this.listChannel = res.data.items;
    if (!this.searchForm.channel_id && res.data.items.length > 0) {
      this.searchForm.channel_id = res.data.items[0].id
    }
  }

}
