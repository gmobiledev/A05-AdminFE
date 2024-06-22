import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class WarningComponent implements OnInit {

  public currentUser: any;
  listCurrentAction: any;
  public list: any;
  public totalItems: number;
  public summaryTask: any;
  public data: any;
  public dataPayment: any;
  dateRange: any;

  msisdns_id: any;

  public searchForm: any = {
    mobile: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    page_size: 20,
    date_range: '',
    telco: '',
    customer_name: '',
    customer_type: '',
    sub_action: 'SIM_CAM_KET'
  }
  public contentHeader: any =  {
    headerTitle: 'Thiết lập cảnh báo',
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
          name: 'Thiết lập cảnh báo',
          isLink: false
        }
      ]
    }
  };

  constructor(    
    private telecomService: TelecomService,
    private route: ActivatedRoute,
    private router: Router,

  ) { 

    this.route.queryParams.subscribe(params => {
      this.msisdns_id = params['msisdns_id'] && params['msisdns_id'] != undefined ? params['msisdns_id'] : '';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }

  ngOnInit(): void {

  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    // ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    // this.searchForm.date_range = daterangeString;
    this.telecomService.exportExcelReport(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Danh sách thuê bao cam kết";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    if(this.currentUser && this.currentUser.roles) {
    }
    this.telecomService.getDetailTask(this.msisdns_id).subscribe(res => {
      this.data = res.data;
    })
    this.telecomService.getPaymentTask(this.msisdns_id).subscribe(res => {
      this.dataPayment = res.data;
    })
    this.telecomService.getSummary().subscribe(res => {
      this.summaryTask = res.data;
    })
  }

}


