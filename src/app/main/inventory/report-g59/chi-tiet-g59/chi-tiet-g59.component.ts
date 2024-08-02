
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-chi-tiet-g59',
  templateUrl: './chi-tiet-g59.component.html',
  styleUrls: ['./chi-tiet-g59.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChiTietG59Component implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Báo cáo chi tiết tình trạng thuê bao',
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
          name: 'Báo cáo chi tiết tình trạng thuê bao',
          isLink: false
        }
      ]
    }
  };

  searchForm = {
    channel_id: '',
    end_date: '',
    start_date: '',
    msisdn: '',
    page_size: 50,
    status: '',
    page: 1
  }
  sumItems = {
    begin_total: 0,
    exported: 0,
    imported: 0,
    total: 0
  }
  listChannel;
  list;
  totalItems;
  submitted = false;
  maxDate;

  constructor(
    private route: ActivatedRoute,
    private readonly inventoryService: InventoryService
  ) {
    this.route.queryParams.subscribe(async params => {
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchForm.msisdn = params['msisdn'] && params['msisdn'] != undefined ? params['msisdn'] : '';
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      let currentDate = new Date(new Date().getTime() - tzoffset);
      let endDate = new Date(new Date().getTime() - tzoffset);
      endDate.setDate(endDate.getDate() - 2);

      this.searchForm.start_date = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() - tzoffset).toISOString().slice(0, 10)
      this.searchForm.end_date = endDate.toISOString().slice(0, 10);
      this.maxDate = endDate.toISOString().slice(0, 10);
      await this.getChannel();
      this.getData();
    })
  }

  ngOnInit(): void {
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.getData();
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
      msisdn: this.searchForm.msisdn,
      page: this.searchForm.page,
      status: this.searchForm.status,
      page_size: this.searchForm.page_size,
      start_date: this.searchForm.start_date ? this.searchForm.start_date + ' 00:00:00' : '',
      end_date: this.searchForm.end_date ? this.searchForm.end_date + ' 00:00:00' : '',
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const listCurrentAction = currentUser.actions;
    if (listCurrentAction.find(itemX => itemX == 'GET@/api/telecom-oracle-admin/report/s99-msisdn')) {
      this.inventoryService.reportChiTietSim(paramsSearch).subscribe(res => {
        this.submitted = false;
        this.sectionBlockUI.stop();
        this.list = res.data.items;
        this.totalItems = res.data.count;
      }, error => {
        this.submitted = false;
        this.sectionBlockUI.stop();
      })
    } else {
      this.inventoryService.reportChiTietSimByAdmin(paramsSearch).subscribe(res => {
        this.submitted = false;
        this.sectionBlockUI.stop();
        this.list = res.data.items;
        this.totalItems = res.data.count;
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

  showStatus(value) {
    let r = value;
    if (value == 'A') {
      r = 'Active'
    } else if (value == 'OC') {
      r = 'S1'
    } else if (value == 'IC') {
      r = 'S2'
    } else if (value == 'HUY') {
      r = 'TH'
    }
    return r;
  }

  exportExcel() {
    this.sectionBlockUI.start();
    this.submitted = true;
    const paramsSearch = {
      channel_id: this.searchForm.channel_id,
      msisdn: this.searchForm.msisdn,
      page: this.searchForm.page,
      status: this.searchForm.status,
      page_size: this.searchForm.page_size,
      start_date: this.searchForm.start_date ? this.searchForm.start_date + ' 00:00:00' : '',
      end_date: this.searchForm.end_date ? this.searchForm.end_date + ' 00:00:00' : '',
    }
    this.inventoryService.exportReportChiTietSim(null, paramsSearch).subscribe(res => {
      this.sectionBlockUI.stop();
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo chi tiet TB";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.submitted = false;
    }, error => {
      console.log(error);
    })
  }

}
