import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { GipService } from 'app/auth/service/gip.service';
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
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.scss']
})
export class ManageListComponent implements OnInit {

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

  public dataExcel = {
    "service_code": "AIRTIME_TOPUP",
    "is_task_account_root": false
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
    private gipService: GipService,


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

  public dataUpdate = {
    amount: 0,
    service_code: "AIRTIME_TOPUP",
    bill_id: "0356342770",
    payment_method: "BANK_TRANSFER",
    desc: '',
    file: "",
    files_confirm: ""
  };

  public dataSub = {

    msisdn: '0973583328',
    state: 1,
  };

  getData(): void {
    this.gipService.getAllGip().subscribe(res => {
      this.list = res.data.items;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  modalOpen(modal, item = null) {
    if (item) {
      // this.selectedUser = item;
      // this.dataCreatePayment.desc = this.selectedUser.mobile + ' thanh toan don hang';
      this.userService.getMerchantService(item.id).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.listServices = res.data;
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }


  modalClose() {

    this.modalRef.close();;
  }


  async onSelectFileAccount(event) {
    this.fileAccount = event.target.files[0];
  }

  async onSelectFileConfirm(event) {
    if (event.target.files && event.target.files[0]) {
      let img = await this.resizeImage(event.target.files[0]);
      this.dataUpdate.files_confirm = (img + '').replace('data:image/png;base64,', '')
    }
  }

  async onSubmitLock() {

    let dataLock = {
      "action": "lock_subcriber",
      "note": "string"
    }

    const confirmMessage = status ? "Bạn có đồng ý Đóng thuê bao" : "Bạn có đồng ý Mở thuê bao?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gipService.lockGip(dataLock).subscribe(res => {
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
    this.router.navigate(['/gip/list'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/list'], { queryParams: this.searchForm })
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;

    this.gipService.exportData(this.searchForm).subscribe(res => {
      console.log(res.body.type)
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Danh sách thuê bao";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })

  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.dataUpdate.bill_id = this.currentUser.phone;
    this.contentHeader = {
      headerTitle: 'Danh sách thuê bao',
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
            name: 'Danh sách thuê bao',
            isLink: false
          }
        ]
      }
    };
  }




  // getDiscount(details: any) {
  //   let obj = details.find((o: { attribute: string; }) => o.attribute === 'discount');
  //   if (obj != null) {
  //     return obj.value;
  //   } else {
  //     return 0;
  //   }

  // }

  // getAmountBefore(details: any, amount: number) {
  //   let obj = details.find((o: { attribute: string; }) => o.attribute === 'amount_before');
  //   if (obj != null) {
  //     return obj.value;
  //   } else {
  //     return amount;
  //   }
  // }

  // async onCancelTask(item) {
  //   if ((await this.alertService.showConfirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")).value) {
  //     this.itemBlockUI.start();
  //     this.taskService.getTaskDelete(item.id).subscribe(res => {
  //       this.itemBlockUI.stop();
  //       if (!res.status) {
  //         this.alertService.showMess(res.message);
  //         return;
  //       }
  //       this.alertService.showSuccess(res.message);
  //       this.modalClose();
  //     }, error => {
  //       this.itemBlockUI.stop();
  //       this.alertService.showMess(error);
  //       return;
  //     })
  //   }
  // }

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

  async onCreateTask() {
    // if (this.dataUpdate.amount < 100000) {
    //   this.alertService.showMess("Vui lòng Nhập số tiền lớn hơn 100.000 VNĐ");
    //   return;
    // }

    if (this.isCreate) {
      // if (this.imageFront == null) {
      //   this.alertService.showMess("Vui lòng tải file ảnh đơn hàng lên!");
      //   return;
      // }

      if ((await this.alertService.showConfirm("Bạn có đồng ý thêm thuê bao này ko?")).value) {
        // if (this.imageFront) {
        //   this.dataUpdate.file = this.imageFront.replace('data:image/png;base64,', '')
        // }
        this.itemBlockUI.start();
        this.gipService.getTasks(this.dataUpdate).subscribe(res => {
          this.itemBlockUI.stop();
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.modalClose();
          // this.router.navigateByUrl(`/payment/${res.data.id}`)
          this.getData();
        }, error => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        })
      }
    } else {
      // if ((await this.alertService.showConfirm("Bạn có đồng ý thêm thuê bao này ko?")).value) {
      // if (this.imageFront) {
      //   this.dataUpdate.file = this.imageFront.replace('data:image/png;base64,', '')
      // }
      // this.itemBlockUI.start();
      // this.taskService.updateTaskPayment(this.selectedId, this.dataUpdate).subscribe(res => {
      //   this.itemBlockUI.stop();
      //   if (!res.status) {
      //     this.alertService.showMess(res.message);
      //     return;
      //   }
      //   this.alertService.showSuccess(res.message);
      //   this.modalClose();
      //   this.getData();
      // }, error => {
      //   this.itemBlockUI.stop();
      //   this.alertService.showMess(error);
      //   return;
      // })
      // }
    }
  }

}


