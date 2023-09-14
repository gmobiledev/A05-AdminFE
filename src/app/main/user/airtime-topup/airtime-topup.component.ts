import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'app/auth/service/task.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonService } from 'app/utils/common.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { UserService } from 'app/auth/service';
dayjs.locale('vi')
import { GtalkService } from 'app/auth/service/gtalk.service';

@Component({
  selector: 'app-airtime-topup',
  templateUrl: './airtime-topup.component.html',
  styleUrls: ['./airtime-topup.component.scss']
})
export class AirtimeTopupComponent implements OnInit {
  @Input() service: string;

  public contentHeader: any;
  public list: any;
  public totalItems: number;
  public page: any;
  public total: any;
  public pageSize: any;
  public listCurrentAction: any;
  public listCurrentRoles: any;
  public listFiles: any;
  public selectedItem: any;
  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    trans_id: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
    page: 1,
    service_code: '',
    page_size: 20,
    money_out: 0
  }

  public dataExcel = {
    "service_code": "AIRTIME_TOPUP",
    "is_task_account_root": false
  }

  public task;
  public trans;
  public wh;

  dataRollBack = {
    id: 0,
    file: ''
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public modalRef: any;

  constructor(
    private readonly alertService: SweetAlertService,
    private readonly taskService: TaskService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private gtalkService: GtalkService,
    private telecomService: TelecomService,
    private userService: UserService,


  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.is_customer_sign = params['is_customer_sign'] && params['is_customer_sign'] != undefined ? params['is_customer_sign'] : '';
      this.searchForm.is_guarantee_sign = params['is_guarantee_sign'] && params['is_guarantee_sign'] != undefined ? params['is_guarantee_sign'] : '';
      this.searchForm.is_bank_sign = params['is_bank_sign'] && params['is_bank_sign'] != undefined ? params['is_bank_sign'] : '';
      this.searchForm.daterange = params['daterange'] && params['daterange'] != undefined ? params['daterange'] : '';

      this.route.data.subscribe(data => {
        console.log(data);
      });
      this.getData();

    })
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.listCurrentAction = user.actions;
    this.listCurrentRoles = user.roles;
    this.contentHeader = {
      headerTitle: 'Danh sách đơn airtime',
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
            name: 'Danh sách đơn airtime',
            isLink: false
          }
        ]
      }
    };
  }

  checkRole(item) {
    return this.listCurrentRoles.find(itemX => itemX.item_name.includes(item))
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

  onSubmitSearch(): void {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.daterange = daterangeString;
    this.router.navigate(['/user/airtime'], { queryParams: this.searchForm })
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.daterange = daterangeString;

    this.userService.exportExcelReport(this.dataExcel, this.searchForm).subscribe(res => {
      console.log(res.body.type)
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo Airtime";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })

  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/user/airtime'], { queryParams: this.searchForm })
  }

  async onUpdateStatus(item, status) {
    let data = {
      id: item.id,
      status: status,
      note: ''
    }
    if (status == 99 || (status == 10 && this.checkAction("ACCOUNTING")) || status == 1) {
      let titleS;
      if (status == 99) {
        titleS = 'Từ chối yêu cầu, gửi lý do cho đại lý'
      }
      if (status == 1) {
        titleS = 'Xác nhận đã nhận được tiền, lưu ghi chú'
      }

      Swal.fire({
        title: titleS,
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Gửi',
        showLoaderOnConfirm: true,
        preConfirm: (note) => {
          if (!note || note == '') {
            Swal.showValidationMessage(
              "Vui lòng nhập nội dung"
            )
            return;
          }
          data.note = note;
          this.taskService.departmentUpdateTaskStatus(data).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              this.getData();
              //this.updateStatus.emit({updated: true});
              // this.alertService.showSuccess('Thành công');
              return;
            }
            this.modalClose();
            this.getData();
            this.alertService.showSuccess(res.message);
          }, error => {
            Swal.showValidationMessage(
              error
            )
          });

        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {       
          //this.updateStatus.emit({updated: true});
          // this.alertService.showSuccess('Thành công');
        }
      })
    } else {
      let confirmMessage = "";
      if (status == 20) {
        confirmMessage = 'Xác nhận duyệt yêu cầu';
        data.note = "Xác nhận"
      }

      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.taskService.departmentUpdateTaskStatus(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.modalClose();
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
    }
  }

  getMoneyBeforeDiscount(details, amount) {
    const item = details.find(x => x.attribute == 'amount_before');
    return item ? parseInt(item.value) : amount;
  }

  getMoneyAfterDiscount(details, amount) {
    const item = details.find(x => x.attribute == 'amount_after');
    return item ? parseInt(item.value) : amount;
  }

  getDiscount(details) {
    const item = details.find(x => x.attribute == 'discount');
    return item ? item.value : 0;
  }

  async onRollback() {
    if (!this.dataRollBack.file) {
      this.alertService.showMess('Vui lòng đính kèm phê duyệt hoàn giao dịch');
      return;
    }
    if ((await this.alertService.showConfirm('Bạn có đồng ý thực hiện thao tác?')).value) {
      this.taskService.rollBackTask(this.dataRollBack).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.getData();
        this.alertService.showSuccess(res.message);
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      let img = await this.commonService.resizeImage(event.target.files[0]);
      this.dataRollBack.file = (img + '').replace('data:image/png;base64,', '')
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

  modalOpen(modal, item) {
    this.selectedItem = item;
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.dataRollBack = {
      id: 0,
      file: ''
    }
    this.modalRef.close();
  }

  getData(): void {
    this.taskService.getAllAirTime(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
