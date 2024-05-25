import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
const ExcelJS = require('exceljs');

@Component({
  selector: 'app-ket-qua',
  templateUrl: './ket-qua.component.html',
  styleUrls: ['./ket-qua.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class KetQuaComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  public contentHeader = {
    headerTitle: 'Báo cáo kết quả triển khai',
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
          name: 'Báo cáo kết quả triển khai',
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
  dataExcel;
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
    this.inventoryService.reportKetQuaSim(paramsSearch).subscribe(res => {
      this.sectionBlockUI.stop();
      this.submitted = false;
      this.list = res.data;      

    }, error => {
      this.submitted = false;
      this.sectionBlockUI.stop();
    })
  }

  async getChannel() {
    const res = await this.inventoryService.getMyChannel(null).toPromise();
    this.listChannel = res.data.items;
  }

  async exportExcel() {
    let wb = new ExcelJS.Workbook();
    const worksheet = wb.addWorksheet('My Sheet');
    worksheet.columns = [
      { letter: 'A', header: 'Đơn vị', key: 'name' },
      { letter: 'B', header: 'SL đăng ký', key: 'total_register' },
      { letter: 'C', header: 'Bàn giao', key: 'received' },
      { letter: 'D', header: 'Tỉ lệ', key: 'percent' },
      { letter: 'E', header: 'Số lượng TB hoạt động', key: 'actived' },
      { letter: 'F', header: 'Số thuê bao hoạt động luỹ kế', key: 'luy_ke_actived' },
      { letter: 'G', header: 'Số TB hoàn thiện TTTB', key: 'hoan_thien_tttb' },
      { letter: 'H', header: 'Doanh thu topup', key: 'sum_topup' },
      { letter: 'I', header: 'Doanh thu tiêu dùng', key: 'sum_cost' },
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


