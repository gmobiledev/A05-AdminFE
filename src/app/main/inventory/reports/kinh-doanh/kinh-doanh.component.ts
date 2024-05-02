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
    page_size: 200,
    reference_code: ''
  }
  totalItems;
  sumItems;

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
    this.inventoryServie.summaryReport(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
      this.sum(this.list);
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
