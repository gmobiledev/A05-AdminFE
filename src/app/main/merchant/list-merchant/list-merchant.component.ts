import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { CommonService } from 'app/utils/common.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-merchant',
  templateUrl: './list-merchant.component.html',
  styleUrls: ['./list-merchant.component.scss']
})
export class ListMerchantComponent implements OnInit {

  public modalRef: any;
  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: '',
    page: 1,
  }
  public selectedUser: any;
  public listServices: any;
  public listBalances: any;

  public price;
  public discount;

  public dataCreatePayment = {
    amount: 0,
    service_code: "AIRTIME_TOPUP",
    bill_id: "0356342770",
    payment_method: "BANK_TRANSFER",
    desc: '',
    file: ''
  };

  public dataCreateMerchant = {
    services: ['AIRTIME_TOPUP'],
    username: '',
    mobile: '',
    password: '',
    email: ''
  }

  public dataPrepaidLimit = {
    title: "Giao dịch cộng tiền cho khách hàng",
    desc: "Thực hiện giao dịch với khách hàng",
    amount: 0,
    service: "ADD_MONEY_BALANCE",
    file: "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",
    type: "Cộng tiền",
    merchant_id: 1, 
    user_id : 1073
  }

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/airtime/list'], { queryParams: { keyword: this.searchForm.keyword, status: this.searchForm.status } })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/airtime/list'], { queryParams: this.searchForm })
  }

  async onSubmitLock(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.lockUser(id, status, "").subscribe(res => {
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

  async onCreateTask() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo yêu cầu nạp airtime?")).value) {
      this.itemBlockUI.start();
      this.dataCreatePayment.bill_id = this.selectedUser.mobile;
      this.taskService.createTask(this.selectedUser.id, this.dataCreatePayment).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onCreateMerchant() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo tài khoản đại lý?")).value) {
      this.itemBlockUI.start();
      this.userService.createMerchant(this.dataCreateMerchant).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.dataCreateMerchant = {
          services: ['AIRTIME_TOPUP'],
          username: '',
          mobile: '',
          password: '',
          email: ''
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onCreatePrepaidLimit() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo yêu cầu nạp airtime?")).value) {
      this.itemBlockUI.start();
      this.taskService.createTaskPrepaidLimit(this.dataPrepaidLimit).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }


  onViewBalance() {
    this.alertService.showMess("Tính năng đang phát triển");
    return;
  }

  modalOpen(modal, item = null) {
    if (item) {
      this.selectedUser = item;
      this.dataCreatePayment.desc = this.selectedUser.mobile + ' thanh toan don hang';
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

  modalBalanceOpen(modal, item) {
    this.userService.getMerchantBalances(item.id).subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.listBalances = res.data;

      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    })
  }

  modalClose() {
    this.dataCreatePayment = {
      amount: 0,
      service_code: "AIRTIME_TOPUP",
      bill_id: "0356342770",
      payment_method: "BANK_TRANSFER",
      desc: '',
      file: ''
    };
    this.modalRef.close();;
  }

  onCompletedInputPassword(value) {
    this.dataCreateMerchant.password = value;
    // this.formGroup.patchValue({
    //   password: value
    // })
  }

  onInputAmount(event) {
    this.taskService.calculatePriceDiscount({ service_code: this.dataPrepaidLimit.service, amount: this.dataPrepaidLimit.amount }).subscribe(res => {
      this.price = res.data.amount
      // this.discount = res.data.discount
    })
    // this.taskService.calculatePriceDiscount({ service_code: this.dataCreatePayment.service_code, amount: this.dataCreatePayment.amount }).subscribe(res => {
    //   this.price = res.data.amount
    //   this.discount = res.data.discount
    // })

  }


  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.dataCreatePayment.file = image.replace('data:image/png;base64,', '')
    }
  }

  async onSelectFilePrepaidLimit(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.dataPrepaidLimit.file = image.replace('data:image/png;base64,', '')
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách merchant',
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
            name: 'Danh sách merchant',
            isLink: false
          }
        ]
      }
    };
  }

  getData(): void {
    this.sectionBlockUI.start();
    this.userService.getAllMerchant(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }
}
