import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

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
  public formGroup: FormGroup;

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
  public contentHeader: any = {
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

  public basicDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public timeOptions: FlatpickrOptions = {
    enableTime: true,
    noCalendar: true,
    altInput: true
  };

  constructor(
    private telecomService: TelecomService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: SweetAlertService,

  ) {

    this.route.queryParams.subscribe(params => {
      this.msisdns_id = params['msisdns_id'] && params['msisdns_id'] != undefined ? params['msisdns_id'] : '';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }


  dataFrom = {
    "remind_terminate": {
      "remind_terminate": "",
      "s1": {
        "before_days": "",
        "action_time": "",
        "message": ""
      },
      "s2": {
        "before_days": "",
        "action_time": "",
        "message": ""
      },
      "terminate": {
        "before_days": "",
        "action_time": "",
        "message": ""
      }
    },
    "remind_active": {
      "remind_active": "",
      "before_days": "",
      "action_time": "",
      "message": ""
    },
    "remind_s1_s2": {
      "remind_s1_s2": "",
      "before_days": "",
      "action_time": "",
      "message": ""
    }
  }

  result = [];

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

  convert(x, results) {
    for (let key in x) {
      let index = results.findIndex(item => item.meta_key === key);
      if (typeof x[key] !== 'object' && !["remind_terminate", "remind_active", "remind_s1_s2"].includes(key)) {
        if (index !== -1) {
          results[index] = {
            meta_key: key,
            meta_value: x[key]
          }
        } else {
          results.push({
            meta_key: key,
            meta_value: x[key]
          })
        }

      } else if (typeof x[key] === 'object') {
        if (index !== -1) {
          results[index]['child'] = [];
        } else {
          index = results.push({
            meta_key: key,
            meta_value: x[key][key] || "on",
            child: []
          }) - 1

        }
        this.convert(x[key], results[index]['child']);
      }
    }
    return results;
  }

  async onSubmitCreate() {
    // this.convert(this.dataFrom, this.result)

    if ((await this.alertService.showConfirm("Bạn có đồng ý thực hiện thao tác?")).value) {
      this.telecomService.postSetting(this.convert(this.dataFrom, this.result)).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }

        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }

  }

  getData() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    if (this.currentUser && this.currentUser.roles) {
    }

    this.telecomService.getSummary().subscribe(res => {
      this.summaryTask = res.data;
    })

  }

}


