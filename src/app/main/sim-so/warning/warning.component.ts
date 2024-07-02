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

  formPost = {
    remind_terminate: '',
    s1: {
      before_days: '',
      action_time: '',
      message: ''
    }
  }

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

  dataSetting = {
    remind_terminate: "",
    s1: {
      before_days: ["2024-07-09T17:00:00.000Z"],
      action_time: ["2024-07-02T05:00:00.000Z"],
      message: ""
    }
  };


  dataArr() {
    [
      {
        "meta_key": "remind_terminate", //Cảnh báo trước khi thu hồi sim cam kết
        "meta_value": "on", //on hoặc off
        "child": [
          {
            "meta_key": "s1", //khóa 1 chiều
            "meta_value": "on",
            "child": [
              {
                "meta_key": "before_days", //trước ngày
                "meta_value": 1 //số ngày
              },
              {
                "meta_key": "action_time", //thời gian gửi thông báo
                "meta_value": "16:00" //thời gian hạng HH:mm (24h)
              },
              {
                "meta_key": "message", //Nội dung gửi thông báo
                "meta_value": "abc xyz"
              }
            ]
          },
          {
            "meta_key": "s2",
            "meta_value": "on",
            "child": [
              {
                "meta_key": "before_days",
                "meta_value": 1
              },
              {
                "meta_key": "action_time",
                "meta_value": "16:00"
              },
              {
                "meta_key": "message",
                "meta_value": "abc xyz"
              }
            ]
          },
          {
            "meta_key": "terminate",
            "meta_value": "on",
            "child": [
              {
                "meta_key": "before_days",
                "meta_value": 1
              },
              {
                "meta_key": "action_time",
                "meta_value": "16:00"
              },
              {
                "meta_key": "message",
                "meta_value": "abc xyz"
              }
            ]
          }
        ]
      },
      {
        "meta_key": "remind_active", //Cảnh báo kích hoạt thuê bao trước 72h
        "meta_valye": "on",
        "child": [
          {
            "meta_key": "before_days",
            "meta_value": 1
          },
          {
            "meta_key": "action_time",
            "meta_value": "16:00"
          },
          {
            "meta_key": "message",
            "meta_value": "abc xyz"
          }
        ]
      },
      {
        "meta_key": "remind_s1_s2", //Cảnh báo khóa 1 chiều/2chieeuf
        "meta_valye": "on",
        "child": [
          {
            "meta_key": "action_time",
            "meta_value": "16:00"
          },
          {
            "meta_key": "message",
            "meta_value": "abc xyz"
          }
        ]
      }
    ]
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

  convertSetting = (data) => {
    return {
      meta_key: "remind_terminate",
      meta_value: data.remind_terminate || "on", // Đặt giá trị theo yêu cầu của bạn
      child: Object.keys(data).filter(key => key !== 'remind_terminate').map(key => {
        const childData = data[key];
        return {
          meta_key: key,
          meta_value: "on", // Đặt giá trị theo yêu cầu của bạn
          child: Object.keys(childData).map(childKey => {
            const value = childData[childKey];
            return {
              meta_key: childKey,
              meta_value: Array.isArray(value) && value.length > 0 ? value[0] : value
            };
          })
        };
      })
    };
  };


  getDataSetting() {
    const convertedData = this.convertSetting(this.dataSetting);

    console.log("12345 ====== ",JSON.stringify(convertedData, null, 2));

  }


  async onSubmitCreate() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý thực hiện thao tác?")).value) {
      this.telecomService.postSetting(this.formPost).subscribe(res => {
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
    this.getDataSetting()

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    if (this.currentUser && this.currentUser.roles) {
    }

    this.telecomService.getSummary().subscribe(res => {
      this.summaryTask = res.data;
    })

  }

}


