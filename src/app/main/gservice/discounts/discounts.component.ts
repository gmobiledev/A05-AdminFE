import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GServiceService } from 'app/auth/service/gservice.service';
import { TaskService } from 'app/auth/service/task.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';
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

  public dataCreate = {
    name: '',
    service_id: [],
    date_range: '',
    start_money: 0,
    end_money: 0,
    value: 0,
    file: ''
  }

  public task;
  public trans;
  public wh;

  public modalRef: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

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
      class: [''],
      credentials: this.fb.array([]),
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
      this.detailDiscount(14);
    })
  }

  addCreds() {
    const creds = this.form.controls.credentials as FormArray;
    creds.push(
      this.fb.group({
        username: '',
        password: '',
        sdt: '',
      })
    );
  }

  removeCreds(i) {
    let creds = this.form.controls.credentials as FormArray;
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
      this.dataCreate.file = (img + '').replace('data:image/png;base64,', '')
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
      let tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dataCreate.date_range = this.dateRange.startDate && this.dateRange.endDate
        ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    }

    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo đơn hàng này không?")).value) {
      if (!this.dataCreate.date_range || !this.dataCreate.end_money || !this.dataCreate.start_money || !this.dataCreate.name || !this.dataCreate.value) {
        this.alertService.showMess('Vui lòng nhập đầy đủ thông tin');
        return;
      }
      if (this.dataCreate.service_id.length < 1) {
        this.alertService.showMess('Vui lòng chọn dịch vụ');
        return;
      }
      this.gServiceService.createDiscount(this.dataCreate).subscribe(res => {
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
    this.modalRef.close();;
  }

  onChangeCheckBox(event, item) {
    if (event.target.checked) {
      this.dataCreate.service_id.push(event.target.value);
    }
    else {
      const i = this.dataCreate.service_id.findIndex(value => value == event.target.value);
      if (i) {
        this.dataCreate.service_id.splice(i, 1);
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
        this.dataCreate.service_id = [airtime.id];
      }
    })


  }

  detailDiscount(id){
    this.gServiceService.getDiscountDetail(id).subscribe(res => {
      this.listDiscount = res.data;
      this.totalItems = res.data.count;
    })

  }

}
