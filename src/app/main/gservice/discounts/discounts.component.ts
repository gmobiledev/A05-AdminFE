import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GServiceService } from 'app/auth/service/gservice.service';
import { TaskService } from 'app/auth/service/task.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import dayjs from 'dayjs';
import { CommonService } from 'app/utils/common.service';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DiscountsComponent implements OnInit {
  form: FormGroup;

  public contentHeader: any;
  public list: any;
  public listDiscount: any;
  public totalItems: number;
  public page: any;
  public total: any;
  public pageSize: any;
  public listCurrentAction: any;
  public listCurrentRoles: any;
  public listFiles: any;
  public selectedItem: any;
  public dateRange: any;
  public listServices: any;
  public task;
  public trans;
  public wh;

  public arrayServiceIds = [];

  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    trans_id: '',
    page: 1,
    service_code: '',
    page_size: 20
  }

  public modalRef: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  // public dataCreate = {
  //   name: '',
  //   service_id: [],
  //   date_range: '',
  //   start_money: 0,
  //   end_money: 0,
  //   value: 0,
  //   file: ''
  // }

  constructor(
    private readonly alertService: SweetAlertService,
    private readonly taskService: TaskService,
    private readonly gServiceService: GServiceService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      // service_id: this.fb.array([]),
      name: [''],
      date_range: [''],
      items: this.fb.array([]),
      file: [''],
    });

    this.route.queryParams.subscribe(params => {
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;

      this.route.data.subscribe(data => {
        console.log(data);
      });

      this.getData();
    })
  }

  addCreds() {
    const creds = this.form.controls.items as FormArray;
    console.log(creds);
    const last = creds.controls[creds.controls.length-1] as FormGroup;
    console.log(last);
    creds.push(
      this.fb.group({
        start_money: last ? last.controls.end_money.value + 1 : 0,
        end_money: 0,
        value: 0,
      })
    );
  }

  removeCreds(i) {
    let creds = this.form.controls.items as FormArray;
    creds.removeAt(i)
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.listCurrentAction = user.actions;
    this.listCurrentRoles = user.roles;
    this.contentHeader = {
      headerTitle: 'Chương trình chiết khấu',
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
            name: 'Chương trình chiết khấu',
            isLink: false
          }
        ]
      }
    };
  }

  checkAction(action) {
    return this.listCurrentRoles.find(item => item.item_name.includes(action))
  }

  onSubmitSearch(): void {
    this.router.navigate(['/services/discount'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/services/discount'], { queryParams: this.searchForm })
  }

  modalOpen(modal, item = null) {
    if (item) {
      this.selectedItem = item;
      this.detailDiscount(item.id);

    }
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      let img = await this.commonService.resizeImage(event.target.files[0]);
      this.form.controls.file.setValue((img + '').replace('data:image/png;base64,', ''))
    }
  }

  modalOpenDiscount(modal, item) {
    if (item) {
      this.selectedItem = item;
    }
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  async onCreate() {
    if (this.dateRange) {
      console.log(this.dateRange)
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.form.controls.date_range.setValue(this.dateRange.startDate && this.dateRange.endDate ?
        (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' +
        (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '');
    }
    const postData = { ...this.form.value, ...{ service_id: this.arrayServiceIds } };
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo đơn hàng này không?")).value) {
      if (!this.form.controls.date_range.value || !this.form.controls.name.value ) {
        this.alertService.showMess('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      if (this.arrayServiceIds.length < 1) {
        this.alertService.showMess('Vui lòng chọn dịch vụ');
        return;
      }
      this.gServiceService.createDiscount(postData).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }

    
    console.log(this.form.value)
    console.log(postData)
  }

  onViewDetail(modal, item) {
    this.selectedItem = item;
    this.taskService.getFileMerchantAttach(item.id).subscribe(res => {
      if (res.status && res.data) {
        this.listFiles = res.data;
      }
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }, error => {

    })
  }

  modalClose() {
    this.form = this.fb.group({
      name: [''],
      date_range: [''],
      items: this.fb.array([]),
      file: [''],
    });

    this.modalRef.close();

  }

  onChangeCheckBox(event, item) {
    if (event.target.checked) {
      this.arrayServiceIds.push(event.target.value);
    }
    else {
      const i = this.arrayServiceIds.findIndex(value => value == event.target.value);
      if (i) {
        this.arrayServiceIds.splice(i, 1);
      }
    }
  }

  getData(): void {
    this.gServiceService.getDiscount(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.gServiceService.getAllService().subscribe(res => {
      this.listServices = res.data;
      const airtime = this.listServices.find(item => item.code == 'AIRTIME_TOPUP');

      if (airtime) {
        this.listServices = [airtime];
        this.arrayServiceIds = [airtime.id];
      }
    })
  }

  detailDiscount(id) {
    this.gServiceService.getDiscountDetail(id).subscribe(res => {
      this.listDiscount = res.data;
      this.totalItems = res.data.count;
    })
  }

  async onSubmitLock(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý Bặt dịch vụ?" : "Bạn có đồng ý Tắt dịch vụ?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gServiceService.lockService(id, status, "").subscribe(res => {
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

}
