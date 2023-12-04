import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/auth/service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';
import Swal from 'sweetalert2';
import { GipService } from 'app/auth/service/gip.service';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.scss']
})

export class CallHistoryComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;

  public isViewFile: boolean = false;
  public urlFile: any;
  public listServices: any;

  public price: number;
  public discount: number;

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public subFormGroup: FormGroup;
  public modalUserCodeRef: any;
  public formGroupUserCode: FormGroup;
  public isCreate: boolean = false;
  public submitted: boolean = false;
  public exitsUser: boolean = false;
  public isShowAddInput: boolean = true;
  public selectedUserId: number;
  public selectedId: number;
  public selectedItem: any;
  public fileAccount: any;
  public erroMess: string;
  public imageFront;
  public currentUser;

  public btnFormPayment = 'Tạo đơn hàng';

  public searchForm = {
    status: '',
    page: 1,
    take: 10,
    skip: 0,
    service_code: '',
    date_range: '',
    topup: ''

  }

  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }



  constructor(
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private gipServer: GipService


  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.take = params['take'] && params['take'] != undefined ? params['take'] : 10;
      this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : 'AIRTIME_TOPUP';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }


  public dataCall = {
    merchant_id: 1050,
    msisdn: '0598282048',
    start_date: '2023-11-01',
    end_date: '2023-11-30',
    page_size: 10,
    page: 1,
    type: 'call'
  };




  getData(): void {
    this.gipServer.getCallHistory(this.dataCall).subscribe(res => {
      this.list = res.data;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  async onSelectFileAccount(event) {
    this.fileAccount = event.target.files[0];
  }


  async onSubmitLock(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý Đóng thuê bao" : "Bạn có đồng ý Mở thuê bao?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      // this.gServiceService.lockService(id, status, "").subscribe(res => {
      //   if (!res.status) {
      //     this.alertService.showError(res.message);
      //     return;
      //   }
      //   this.alertService.showSuccess(res.message);
      //   this.getData();
      // }, err => {
      //   this.alertService.showError(err);
      // })
    }
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      partner_user_code: [''],
      channel_id: [''],
      agents_service: this.formBuilder.array([]),
      new_agents_service: this.formBuilder.array([])
    });

    this.formGroupUserCode = this.formBuilder.group({
      partner_user_code: [''],
      channel_id: [''],
    });

    this.exitsUser = false;
    this.isCreate = true;
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gip/call-history'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/call-history'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.contentHeader = {
      headerTitle: 'Lịch sử cuộc gọi',
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
            name: 'Lịch sử cuộc gọi',
            isLink: false
          }
        ]
      }
    };
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0])
    }
  }

  resizeImage(image) {
    return new Promise((resolve) => {
      let fr = new FileReader;
      fr.onload = () => {
        var img = new Image();
        img.onload = () => {
          console.log(img.width);
          let width = img.width < 900 ? img.width : 900;
          let height = img.width < 900 ? img.height : width * img.height / img.width;
          console.log(width, height);
          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d');
          if (ctx != null) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          let data = canvas.toDataURL('image/png');
          resolve(data);
        };

        // @ts-ignore
        img.src = fr.result;
      };

      fr.readAsDataURL(image);
    })
  }


}
