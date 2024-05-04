import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { InventoryService } from 'app/auth/service/inventory.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-kinh-doanh',
  templateUrl: './kinh-doanh.component.html',
  styleUrls: ['./kinh-doanh.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KinhDoanhComponent implements OnInit {

  @ViewChild(DatatableComponent)      // import {DatatableComponent} from '@swimlane/ngx-datatable';
  private readonly table: DatatableComponent;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Báo cáo tổng hợp S99',
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
          name: 'Báo cáo tổng hợp S99',
          isLink: false
        }
      ]
    }
  };
  public list = [];
  searchForm = {
    page: 1,
    page_size: 200,
    reference_code: ''
  }
  totalItems;
  sumItems;
  enableSummary = true;
  summaryPosition = 'bottom';
  ColumnMode = ColumnMode
  dataToExport = []

  constructor(
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
    this.inventoryServie.summaryReport(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
      this.sum(this.list);

      this.dataToExport = this.list.map((item, index) => {
        return {
          'STT': index + 1,
          'TÊN ĐƠN VỊ': item.name,
          'SL ĐĂNG KÝ': item.imported_quantility,
          'SL BÀN GIAO': item.level,
          'TB HOẠT ĐỘNG': item.sum_active,
          'HOÀN THIỆN TTTB': item.sum_completed_infor_sim,
          'DOANH THU': item.sum_revenue
        }
      })
      this.dataToExport.push({
        'STT': "",
        'TÊN ĐƠN VỊ': "Tổng",
        'SL ĐĂNG KÝ': this.sumItems.imported_quantility,
        'SL BÀN GIAO': this.sumItems.level,
        'TB HOẠT ĐỘNG': this.sumItems.sum_active,
        'HOÀN THIỆN TTTB': this.sumItems.sum_completed_infor_sim,
        'DOANH THU': this.sumItems.sum_revenue
      })
    }, error => {
      this.sectionBlockUI.stop();
      this.alertService.showMess(error);
    })
  }

  sum(data) {
    var total = {}
    data.forEach(item => {
      for (const key of Object.keys(item)) {
        if (!total[key])
          total[key] = 0
        if (item[key])
          total[key] += parseInt(item[key]);
      }
    });
    this.sumItems = total;
  }

  public getRowIndex(row: any): number {
    return this.table.bodyComponent.getRowIndex(row); // row being data object passed into the template
  }
  public sumValue(cells: number[]): string {
    const filteredCells = cells.filter(cell => !!cell);
    let x = filteredCells.reduce((sum, cell) => (sum += cell), 0);
    return Number(x).toLocaleString('en-GB');
  }

  formatCsvLink() {

    let data = this.list;
  }

  exportExcelReport() {
    this.inventoryServie.xuatBaoCaoTongHop(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo kho sim";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

}
