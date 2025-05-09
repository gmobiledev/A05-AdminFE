
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { InventoryService } from 'app/auth/service/inventory.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
const ExcelJS = require('exceljs');
import { AdminService } from 'app/auth/service/admin.service';

@Component({
  selector: 'app-tong-hop-g59',
  templateUrl: './tong-hop-g59.component.html',
  styleUrls: ['./tong-hop-g59.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class TongHopG59Component implements OnInit {

  @ViewChild(DatatableComponent)
  private readonly table: DatatableComponent;
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
    g59_district_name: '',
    g59_commune_name: '',
    end_date: '',
    start_date: '',
    channel_id: '',
  }
  sumItems = {
    count_msisdn: 0,
    actived: 0,
    s1: 0,
    s2: 0,
    th: 0,
    sum_topup: 0,
    sum_cost: 0,
    district: '',
    commune: ''  
  }
  public districtID;
  public communeID;
  listCommunes; 
  listChannel;
  listDistrict;
  list;
  listExecel;
  submitted = false;

  enableSummary = true;
  summaryPosition = 'bottom';
  ColumnMode = ColumnMode;
  maxDate;

  constructor(
    private route: ActivatedRoute,
    private readonly inventoryService: InventoryService,
    private adminSerivce: AdminService,

  ) {
    this.route.queryParams.subscribe(async params => {
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchForm.g59_district_name = params['g59_district_name'] && params['g59_district_name'] != undefined ? params['g59_district_name'] : '';
      this.searchForm.g59_commune_name = params['g59_commune_name'] && params['g59_commune_name'] != undefined ? params['g59_commune_name'] : '';
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      let currentDate = new Date(new Date().getTime() - tzoffset);
      let endDate = new Date(new Date().getTime() - tzoffset);
      endDate.setDate(endDate.getDate() - 2);

      this.searchForm.start_date = new Date(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() - tzoffset).toISOString().slice(0, 10)
      this.searchForm.end_date = endDate.toISOString().slice(0, 10);
      this.maxDate = endDate.toISOString().slice(0, 10);
      await this.getDistrict();
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
      count_msisdn: 0,
      actived: 0,
      s1: 0,
      s2: 0,
      th: 0,
      sum_cost: 0,
      sum_topup: 0,
      district: '',
      commune: ''         

    }

    this.districtID = null;
    this.communeID = null;
    
    if (this.searchForm.g59_district_name != null){
      this.districtID = this.listDistrict.find(element => element.id === this.searchForm.g59_district_name);
    }

    if (this.searchForm.g59_commune_name != null && this.listCommunes != null){
      this.communeID = this.listCommunes.find(element => element.id === this.searchForm.g59_commune_name);
    }

    const paramsSearch = {
      start_date: this.searchForm.start_date ? this.searchForm.start_date + ' 00:00:00' : '',
      end_date: this.searchForm.end_date ? this.searchForm.end_date + ' 00:00:00' : '',
      district_name: this.districtID ? this.districtID.title : "",
      commune_name: this.communeID ? this.communeID.title : "", 
      channel_id: this.searchForm.channel_id ? this.searchForm.channel_id : '',
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    const listCurrentAction = currentUser.actions;
    if (listCurrentAction.find(itemX => itemX == 'GET@/api/telecom-oracle-admin/report/g59-msisdn-state')) {
      this.inventoryService.reportTongHopSimG59(paramsSearch).subscribe(res => {
        this.submitted = false;
        this.sectionBlockUI.stop();
        this.list = res.data;
        for (let item of this.list) {
          this.sumItems.count_msisdn += item.count_msisdn;
          this.sumItems.actived += item.all_status[0]['Active'] ? item.all_status[0]['Active'] : 0;
          this.sumItems.s1 += item.all_status[0]['S1'] ? item.all_status[0]['S1'] : 0;
          this.sumItems.s2 += item.all_status[0]['S2'] ? item.all_status[0]['S2'] : 0;
          this.sumItems.th += item.all_status[0]['TH'] ? item.all_status[0]['TH'] : 0;
          this.sumItems.sum_cost += item.sum_cost;
          this.sumItems.sum_topup += item.sum_topup;
        }
      }, error => {
        this.sectionBlockUI.stop();
      })
    } else if (listCurrentAction.find(itemX => itemX == 'GET@/api/telecom-oracle-admin/report/g59-msisdn-state-by-admin')) {
      this.inventoryService.reportTongHopSimG59ByAdmin(paramsSearch).subscribe(res => {
        this.submitted = false;
        this.sectionBlockUI.stop();
        this.list = res.data;
        for (let item of this.list) {
          this.sumItems.count_msisdn += item.count_msisdn;
          this.sumItems.actived += item.all_status[0]['Active'] ? item.all_status[0]['Active'] : 0;
          this.sumItems.s1 += item.all_status[0]['S1'] ? item.all_status[0]['S1'] : 0;
          this.sumItems.s2 += item.all_status[0]['S2'] ? item.all_status[0]['S2'] : 0;
          this.sumItems.th += item.all_status[0]['TH'] ? item.all_status[0]['TH'] : 0;
          this.sumItems.sum_cost += item.sum_cost;
          this.sumItems.sum_topup += item.sum_topup;
        }
      }, error => {
        this.sectionBlockUI.stop();
      })
    }

  }

  async getDistrict() {
    const res = await this.adminSerivce.getDistrictsAll().toPromise();
    this.listDistrict = res.data;
  }

  async getChannel() {
    const res = await this.inventoryService.getChannelG59(null).toPromise();
    this.listChannel = res.data.items;

  }

  async onChangeHomeDistrict(id, init = null) {

    console.log(id)
    this.searchForm.g59_commune_name = null
    try {
      const res = await this.adminSerivce.getCommunes(id).toPromise();
      if (res.status == 1) {      
        this.listCommunes = res.data        
      }
    } catch (error) {

    }
  }

  async exportExcel() {
    let wb = new ExcelJS.Workbook();
    const worksheet = wb.addWorksheet('My Sheet');
    worksheet.columns = [
      { letter: 'A', header: 'Đơn vị', key: 'name' },
      { letter: 'B', header: 'Quận, Huyện', key: 'district' },
      { letter: 'C', header: 'Phường, Xã', key: 'commune' },
      { letter: 'D', header: 'SL thuê bao', key: 'count_msisdn' },
      { letter: 'E', header: 'Số TB Active', key: 'sum_active' },
      { letter: 'F', header: 'Số TB Khóa 1C', key: 'sum_s1' },
      { letter: 'G', header: 'Số TB Khóa 2C', key: 'sum_s2' },
      { letter: 'H', header: 'Số TB Thu hồi', key: 'sum_th' },
      { letter: 'I', header: 'Doanh thu topup', key: 'sum_topup' },
      { letter: 'J', header: 'Doanh thu tiêu dùng', key: 'sum_cost' },
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

  public getRowIndex(row: any): number {
    return this.table.bodyComponent.getRowIndex(row); // row being data object passed into the template
  }
  public sumValue(cells: number[]): string {
    const filteredCells = cells.filter(cell => !!cell);
    let x = filteredCells.reduce((sum, cell) => (sum += cell), 0);
    return Number(x).toLocaleString('en-GB');
  }

}


