import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
const ExcelJS = require('exceljs');

@Component({
  selector: 'app-tong-hop',
  templateUrl: './tong-hop.component.html',
  styleUrls: ['./tong-hop.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class TongHopComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  public contentHeader = {
    headerTitle: 'Báo cáo tổng hợp tình trạng thuê bao',
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
          name: 'Báo cáo tổng hợp tình trạng thuê bao',
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
  listExecel;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private readonly inventoryService: InventoryService
  ) {
    this.route.queryParams.subscribe(async params => {
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      let currentDate = new Date(new Date().getTime() - tzoffset);
      this.searchForm.start_date = new Date( new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() - tzoffset).toISOString().slice(0,10)
      this.searchForm.end_date = new Date(new Date().getTime() - tzoffset).toISOString().slice(0,10)
      await this.getChannel();
      this.getData();
    })
  }

  ngOnInit(): void {
  }

  getData() {
    this.submitted = true;
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
    this.inventoryService.reportTongHopSim(paramsSearch).subscribe(res => {
      this.submitted = false;
      this.sectionBlockUI.stop();
      this.list = res.data;
      for(let item of this.list) {
        this.sumItems.begin_total += item.begin_total;
        this.sumItems.exported += item.exported;
        this.sumItems.imported += item.imported;
        this.sumItems.total += item.total;
      }
      this.listExecel = res.data.map(x => {
        return {
          name: x.name,
          actived: x.all_status[0]['Active'] ? x.all_status[0]['Active'] : 0,
          s1: x.all_status[0]['S1'] ? x.all_status[0]['S1'] : 0,
          s2: x.all_status[0]['S2'] ? x.all_status[0]['S2'] : 0,
          th: x.all_status[0]['TH'] ? x.all_status[0]['TH'] : 0,
          sum_topup: x.sum_topup,
          sum_cost: x.sum_cost
        }
        
      })
    }, error => {
      this.sectionBlockUI.stop();
    })
  }

  async getChannel() {
    const res = await this.inventoryService.getMyChannel(null).toPromise();
    this.listChannel = res.data.items;
    // if (!this.searchForm.channel_id && res.data.items.length > 0) {
    //   this.searchForm.channel_id = res.data.items[0].id
    // }
  }

  async exportExcel() {
    let wb = new ExcelJS.Workbook();
    const worksheet = wb.addWorksheet('My Sheet');
    worksheet.columns = [
      { letter: 'A', header: 'Đơn vị', key: 'name' },
      { letter: 'B', header: 'SL thuê bao', key: 'count_msisdn' },
      { letter: 'C', header: 'Số TB Active', key: 'actived' },
      { letter: 'D', header: 'Số TB Khóa 1C', key: 's1' },
      { letter: 'E', header: 'Số TB Khóa 2C', key: 's2' },
      { letter: 'F', header: 'Số TB Thu hồi', key: 'th' },
      { letter: 'G', header: 'Doanh thu topup', key: 'sum_topup' },
      { letter: 'H', header: 'Doanh thu tiêu dùng', key: 'sum_cost' },
    ];
    worksheet.addRows(this.list);
    const buffer = await wb.xlsx.writeBuffer();
    var newBlob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(newBlob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = "bao cao ket qua trien khai.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    return;
  }

}


