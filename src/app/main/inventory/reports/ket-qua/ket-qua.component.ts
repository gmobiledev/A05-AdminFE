import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
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
  @ViewChild(DatatableComponent)      // import {DatatableComponent} from '@swimlane/ngx-datatable';
  private readonly table: DatatableComponent;
  
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
    total_register: 0,
    received: 0,
    actived: 0,
    percent: 0,
    luy_ke_actived: 0,
    hoan_thien_tttb: 0,
    sum_cost: 0,
    sum_topup: 0,
  }
  listChannel;
  list;
  dataExcel;
  submitted = false;

  totalItems;
  enableSummary = true;
  summaryPosition = 'bottom';
  ColumnMode = ColumnMode;
  maxDate;

  constructor(
    private route: ActivatedRoute,
    private readonly inventoryService: InventoryService
  ) {
    this.route.queryParams.subscribe(async params => {
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      let currentDate = new Date(new Date().getTime() - tzoffset);
      let endDate = new Date(new Date().getTime() - tzoffset);
      endDate.setDate(endDate.getDate() - 2);
      this.searchForm.start_date = new Date( new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() - tzoffset).toISOString().slice(0,10)
      this.searchForm.end_date = endDate.toISOString().slice(0,10);
      this.maxDate = endDate.toISOString().slice(0,10);
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
      total_register: 0,
      received: 0,
      actived: 0,
      percent: 0,
      luy_ke_actived: 0,
      hoan_thien_tttb: 0,
      sum_cost: 0,
      sum_topup: 0,
    }
    const paramsSearch = {
      channel_id: this.searchForm.channel_id,
      start_date: this.searchForm.start_date ? this.searchForm.start_date + ' 00:00:00' : '',
      end_date: this.searchForm.end_date ? this.searchForm.end_date + ' 00:00:00' : '',
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const listCurrentAction = currentUser.actions;
    
    if (listCurrentAction.find(itemX => itemX == 'GET@/api/telecom-oracle-admin/report/s99-summary-v2')) {
      this.inventoryService.reportKetQuaSim(paramsSearch).subscribe(res => {
        this.sectionBlockUI.stop();
        this.submitted = false;
        this.list = res.data;      
        for(let item of this.list) {
          this.sumItems.total_register += item.total_register;
          this.sumItems.received += item.received;
          this.sumItems.actived += item.actived;
          this.sumItems.luy_ke_actived += item.luy_ke_actived;
          this.sumItems.hoan_thien_tttb += item.hoan_thien_tttb;
          this.sumItems.sum_cost += item.sum_cost;
          this.sumItems.sum_topup += item.sum_topup;
          
        }
        this.sumItems.percent =  Math.round(((this.sumItems.received / this.sumItems.total_register) * 100))
  
      }, error => {
        this.submitted = false;
        this.sectionBlockUI.stop();
      })  
    } else {
      this.inventoryService.reportTonghopS99Admin(paramsSearch).subscribe(res => {
        this.sectionBlockUI.stop();
        this.submitted = false;
        this.list = res.data;      
        for(let item of this.list) {
          this.sumItems.total_register += item.total_register;
          this.sumItems.received += item.received;
          this.sumItems.actived += item.actived;
          this.sumItems.luy_ke_actived += item.luy_ke_actived;
          this.sumItems.hoan_thien_tttb += item.hoan_thien_tttb;
          this.sumItems.sum_cost += item.sum_cost;
          this.sumItems.sum_topup += item.sum_topup;
          
        }
        this.sumItems.percent =  Math.round(((this.sumItems.received / this.sumItems.total_register) * 100))
  
      }, error => {
        this.submitted = false;
        this.sectionBlockUI.stop();
      })
    }

    
  }

  async getChannel() {
    const res = await this.inventoryService.getChannelS99(null).toPromise();
    this.listChannel = res.data.items;
  }

  async exportExcel() {
    let wb = new ExcelJS.Workbook();
    const worksheet = wb.addWorksheet('My Sheet');
    worksheet.columns = [
      { letter: 'A', header: 'Đơn vị', key: 'name' },
      { letter: 'B', header: 'SL đăng ký', key: 'total_register' },
      { letter: 'C', header: 'Bàn giao', key: 'received' },
      { letter: 'D', header: 'Tỉ lệ(%)', key: 'percent' },
      { letter: 'E', header: 'Số lượng TB hoạt động', key: 'actived' },
      { letter: 'F', header: 'Số thuê bao hoạt động luỹ kế', key: 'luy_ke_actived' },
      { letter: 'G', header: 'Số TB hoàn thiện TTTB', key: 'hoan_thien_tttb' },
      { letter: 'H', header: 'Doanh thu topup', key: 'sum_topup' },
      { letter: 'I', header: 'Doanh thu tiêu dùng', key: 'sum_cost' },
    ];
    let exportData = this.list.map(obj => ({...obj}));
    for(let i = 0;i<exportData.length;i++) {
      exportData[i]['percent'] = Math.round((exportData[i]['percent'] * 100))
    }
    worksheet.addRows(exportData);
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

  public getRowIndex(row: any): number {
    return this.table.bodyComponent.getRowIndex(row); // row being data object passed into the template
  }
  public sumValue(cells: number[]): string {
    const filteredCells = cells.filter(cell => !!cell);
    let x = filteredCells.reduce((sum, cell) => (sum += cell), 0);
    return Number(x).toLocaleString('en-GB');
  }

  roundPercent(value) {
    return Math.round((value* 100))
  }

}


