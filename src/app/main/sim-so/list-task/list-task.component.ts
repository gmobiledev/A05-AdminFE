import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { STORAGE_KEY, TaskAction, TaskTelecom, TaskTelecomStatus, TelecomTaskSubAction } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'environments/environment';
import { AdminService } from 'app/auth/service/admin.service';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import dayjs from 'dayjs';
import { GServiceService } from 'app/auth/service/gservice.service';
import Swal from 'sweetalert2';
import { TaskService } from 'app/auth/service/task.service';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListTaskComponent implements OnInit {

  @ViewChild('modalItem') modalItem: ElementRef;
  @ViewChild('modalViewApproveRestore') modalViewApproveRestore: ElementRef;

  public contentHeader: any = {
    headerTitle: 'Yêu cầu của đại lý',
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
          name: 'Yêu cầu của đại lý',
          isLink: false
        }
      ]
    }
  };
  public list: any;
  public totalItems: number;
  public summaryTask: any;

  public isActivedBoxNewInit: boolean = false;
  public isActivedBoxNewProcessing: boolean = false;
  public isActivedBoxUpdateInit: boolean = false;
  public isActivedBoxUpdateProcessing: boolean = false;
  public isActivedBoxChangeSimInit: boolean = false;
  public isActivedBoxChangeSimProcessing: boolean = false;

  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus;
  public selectedItem: any;
  public selectedAgent: any;
  public mineTask = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public mnos: any = []

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
    sub_action: '',
    payment_reference_number: "",
    reference_id: ""
  }
  dateRange: any;
  selectedNote: string;
  telecomTaskSubAction = TelecomTaskSubAction;

  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public modalRef: any;
  listCurrentAction: any;
  public isLoading: boolean = false; // Track loading state

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('item-block-detail') itemBlockDetailUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private adminService: AdminService,
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private readonly gServiceService: GServiceService,
    private readonly taskService: TaskService,


  ) {
    this.dateRange = null;
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = TaskTelecomStatus[key];
        return obj;
      }, {});
      delete this.taskTelecomStatus['STATUS_APPROVED_1'];
      delete this.taskTelecomStatus['STATUS_APPROVED_2'];
      delete this.taskTelecomStatus['STATUS_APPROVED_3'];
      delete this.taskTelecomStatus['STATUS_DVKHKD_REJECT'];
      delete this.taskTelecomStatus['STATUS_PROCESS_TO_MNO'];
      console.log(this.taskTelecomStatus);

      this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.cccd = params['cccd'] && params['cccd'] != undefined ? params['cccd'] : '';
      this.searchForm.customer_name = params['customer_name'] && params['customer_name'] != undefined ? params['customer_name'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.mine = params['mine'] && params['mine'] != undefined ? params['mine'] : '';
      this.searchForm.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      this.searchForm.array_status = params['array_status'] && params['array_status'] != undefined ? params['array_status'] : [];
      this.searchForm.sub_action = params['sub_action'] && params['sub_action'] != undefined ? params['sub_action'] : '';
      this.searchForm.payment_reference_number = params['payment_reference_number'] && params['payment_reference_number'] != undefined ? params['payment_reference_number'] : '';
      this.searchForm.reference_id = params['reference_id'] && params['reference_id'] != undefined ? params['reference_id'] : '';
      this.initActiveBoxSummary();
      if (this.searchForm.action && this.searchForm.array_status.length > 0) {
        this.setActiveBoxSummary(this.searchForm.array_status, this.searchForm.action);
      }
      if (!this.searchForm.action) {
        this.contentHeader.headerTitle = 'Yêu cầu của đại lý';
        this.contentHeader.breadcrumb.links[1] = 'Yêu cầu của đại lý';
      } else if (this.searchForm.action && this.searchForm.action == this.listTaskAction.change_info.value) {
        this.contentHeader.headerTitle = 'Yêu cầu cập nhật TTTB của đại lý';
        this.contentHeader.breadcrumb.links[1] = 'Yêu cầu cập nhật TTTB của đại lý';
      } else if (this.searchForm.action && this.searchForm.action == this.listTaskAction.new_sim.value) {
        this.contentHeader.headerTitle = 'Yêu cầu đấu sim mới của đại lý';
        this.contentHeader.breadcrumb.links[1] = 'Yêu cầu đấu sim mới của đại lý';
      }
      this.getData();
    })

  }

  async modalOpen(modal, item = null) {
    console.log(modal, item);

    if (item) {
      let check;
      this.itemBlockDetailUI.start();
      //neu la task dau noi cho KH doanh nghiep, chuyen sang trang moi
      if (item.customer_id && item.customer_type == 'ORGANIZATION') {
        if ((item.status == TaskTelecomStatus.STATUS_NEW_ORDER_ORGANIZATION || item.status == TaskTelecomStatus.STATUS_NEW_ORDER)
          && (this.checkAction('telecom-admin/task/:slug(\\d+)/update-status') || this.checkAction('telecom-admin/task/:slug(\\d+)/' + item.action + '/update-status'))
        ) {
          try {
            check = await this.telecomService.checkAvailabledTask(item.id);
            if (!check.status) {
              this.getData();
              this.alertService.showMess(check.message);
              return;
            }
            this.itemBlockDetailUI.stop();
            this.router.navigateByUrl('/sim-so/task/' + item.id);
          } catch (error) {
            this.itemBlockDetailUI.stop();
            return;
          }
        } else {
          this.router.navigateByUrl('/sim-so/task/' + item.id);
        }
        return;
      }
      this.selectedItem = item;

      if (item.status != this.taskTelecomStatus.STATUS_CANCEL && item.status != this.taskTelecomStatus.STATUS_SUCCESS) {
        try {
          // if (item.action != 'CHECK_CONVERSION_2G') {
          if ((item.status != this.taskTelecomStatus.STATUS_NEW_ORDER
            && this.checkAction('telecom-admin/task/approve-2g-conversion'))
            || (
              (item.status == this.taskTelecomStatus.STATUS_NEW_ORDER || item.status == this.taskTelecomStatus.STATUS_PROCESSING) &&
              (this.checkAction('telecom-admin/task/:slug(\\d+)/update-status') || this.checkAction('telecom-admin/task/:slug(\\d+)/' + item.action + '/update-status'))
            )

          ) {
            check = await this.telecomService.checkAvailabledTask(item.id);
            if (!check.status) {
              this.getData();
              this.alertService.showMess(check.message);
            }
          }

          // }

          this.itemBlockDetailUI.stop();
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'xl',
            backdrop: 'static',
            keyboard: false
          });
        } catch (error) {
          this.itemBlockDetailUI.stop();
          return;
        }
      } else {
        this.itemBlockDetailUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'xl',
          backdrop: 'static',
          keyboard: false
        });
      }
    }
  }

  async modalOpenDetail(modal, item = null) {
    this.itemBlockUI.start();
    this.selectedItem = item;

    this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  async onSubmitAgain(taskId, status) {
    const confirmMessage = "Bạn có đồng ý thực hiện lại?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gServiceService.lockService(taskId, status, "").subscribe(res => {
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

  async onSubmitRequest(taskId, status, newEmail) {
    const confirmMessage = "Bạn có đồng ý yêu cầu hoàn tiền ?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gServiceService.lockService(taskId, status, "").subscribe(res => {
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

  async onSubmitConfirm(taskId, status) {
    const confirmMessage = "Bạn có đồng ý xác nhận đã hoàn tiền ?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gServiceService.lockService(taskId, status, "").subscribe(res => {
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


  async onSubmitMKH(taskId, status) {
    const confirmMessage = "Nhập email của bạn";


    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gServiceService.lockService(taskId, status, "").subscribe(res => {
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


  async onSubmitViewMKH(taskId, status) {
    const confirmMessage = "Mã kích hoạt của bạn là: ";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gServiceService.lockService(taskId, status, "").subscribe(res => {
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


  async onUpdateStatus(item, status) {
    let data = {
      id: item.id,
      status: status,
      note: ''
    }


    let titleS = 'Nhập địa chỉ email của bạn!'

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

  }


  // modal Open Success
  modalOpenSuccess(modalSuccess) {
    this.modalService.open(modalSuccess, {
      centered: true,
      windowClass: 'modal modal-primary'
    });
  }


  async modalOpenApproveRestore(modalViewApproveRestore, item = null) {
    if (item) {
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modalViewApproveRestore, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'xl',
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  async modalApprovalOpen(modal, item = null, size = 'xl') {
    if (item) {
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: size,
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  modalClose() {
    this.selectedItem = null;
    this.selectedNote = '';
    this.getData();

    this.modalRef.close();
  }
  async modalViewAgentOpen(modal, item = null) {
    if (item) {
      this.itemBlockUI.start();

      try {
        let res = await this.telecomService.taskViewAgent(item);
        if (!res.status) {
          this.getData();
          this.alertService.showMess(res.message);
        }
        this.selectedAgent = res.data;
        this.itemBlockUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'sm',
          backdrop: 'static',
          keyboard: false
        });
      } catch (error) {
        this.itemBlockUI.stop();
        return;
      }

    }
  }

  modalViewAgentClose() {
    this.selectedAgent = null;
    this.getData();
    this.modalRef.close();
  }

  onGetAvaiable(modalToOpen) {
    this.telecomService.getAvaiable().subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.selectedItem = res.data;
      this.modalRef = this.modalService.open(modalToOpen, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'xl',
        backdrop: 'static',
        keyboard: false
      });
    })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/sim-so/task'], { queryParams: this.searchForm });
  }

  viewDetailSummary(array_status, action) {
    this.searchForm.action = action;
    this.searchForm.array_status = array_status;
    this.router.navigate(['/sim-so/task'], { queryParams: this.searchForm });
  }

  initActiveBoxSummary() {
    this.isActivedBoxChangeSimInit = false;
    this.isActivedBoxChangeSimProcessing = false;
    this.isActivedBoxNewInit = false;
    this.isActivedBoxNewProcessing = false;
    this.isActivedBoxUpdateInit = false;
    this.isActivedBoxUpdateProcessing = false;
  }

  setActiveBoxSummary(array_status, action) {
    if (action == this.listTaskAction.new_sim.value) {
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER + ""])) {
        this.isActivedBoxNewInit = true;
      }
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_PROCESSING + "", "" + this.taskTelecomStatus.STATUS_PROCESS_TO_MNO])) {
        this.isActivedBoxNewProcessing = true;
      }
    } else if (action == this.listTaskAction.change_info.value) {
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER + ""])) {
        this.isActivedBoxChangeSimInit = true;
      }
      if (JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_PROCESSING + "", "" + this.taskTelecomStatus.STATUS_PROCESS_TO_MNO])) {
        this.isActivedBoxChangeSimProcessing = true;
      }
    }
  }

  showDate(date, timeZone, diff) {
    if (!date) {
      return '';
    }
    let dateConverted = new Date(date);
    dateConverted.setMinutes(new Date(date).getMinutes() + diff);
    return formatDate(dateConverted, 'dd/MM/yyyy H:mm', 'en-US', timeZone);
  }

  onSubmitSearch() {
    // Trim input fields
    this.searchForm.mobile = this.searchForm.mobile?.trim() || '';
    this.searchForm.customer_name = this.searchForm.customer_name?.trim() || '';
    this.searchForm.cccd = this.searchForm.cccd?.trim() || '';

    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    this.searchForm.mine = this.mineTask ? 1 : '';
    this.router.navigate(['/sim-so/task'], { queryParams: this.searchForm });
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;

    if (!daterangeString) {
      this.alertService.showError("Bạn cần chọn khoảng thời gian xuất excel")
      return;
    } else {
      var startDate = new Date(this.dateRange.startDate.toISOString())
      var endDate = new Date(this.dateRange.endDate.toISOString())
      var priorDate = new Date(startDate.setDate(startDate.getDate() + 60));

      if (endDate.getTime() > priorDate.getTime()) {
        this.alertService.showError("Chỉ xuất được tối đa trong 60 ngày")
        return;

      }
    }

    this.telecomService.exportExcelReport(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo đấu nối";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, err => {
      this.alertService.showError(err);
    })
  }

  onUpdateStatusSuccess(eventData: { updated: boolean }) {
    if (eventData.updated) {
      this.getData();
      // this.modalRef.close();
    }
  }

  onCreateTaskNewSim(item) {
    this.modalClose();
    // this.modalOpen(this.modalItem, item)
  }

  showApproveText(status) {
    let text = 'Duyệt';
    switch (status) {
      case this.taskTelecomStatus.STATUS_APPROVED_1:
        text = 'Duyệt TTTB';
        break;
      case this.taskTelecomStatus.STATUS_APPROVED:
        text = 'Duyệt hạng số';
        break;
    }
    return text;
  }

  ngOnInit(): void {
    this.getSubscribe();
  }

  getSubscribe() {
    console.log(Notification.permission);
    let isSub = localStorage.getItem(STORAGE_KEY.FCM_SUBSCRIBE) ? true : false;
    if (!isSub) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(() => {
          this.setSubcribe();
        }).catch((error) => {
          console.log(error);
        });
      }
      else if (Notification.permission === 'denied') {
        console.log('denined');
      } else {
        this.setSubcribe();
      }
    }
  }

  async setSubcribe() {
    const firebaseConfig = environment.firebaseConfig;
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    getToken(messaging, { vapidKey: environment.FCM_VAPID_PUBLIC_KEY }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log("Notification Subscription: ", currentToken);
        this.adminService.saveRegId({ reg_id: currentToken }).subscribe(res => {
          localStorage.setItem(STORAGE_KEY.FCM_SUBSCRIBE, currentToken);
        })
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  }


  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    if (this.currentUser && this.currentUser.roles) {
      // const arrayRoles = this.currentUser.roles.map( item => {return item.item_name.toLowerCase()});
      // if(arrayRoles.includes("admin") || arrayRoles.includes("root")) {
      //   this.isAdmin = true;
      //   this.telecomService.getAllTask(this.searchForm).subscribe(res => {
      //     this.list = res.data.items;
      //     this.totalItems = res.data.count;
      //   });
      //   this.telecomService.getSummary().subscribe(res => {
      //     this.summaryTask = res.data;
      //   })
      //   return;
      // }
    }
    // this.telecomService.getAllTaskWorking(this.searchForm).subscribe(res => {
    //   this.list = res.data.items;
    //   this.totalItems = res.data.count;
    // });
    this.isLoading = true; // Disable the button
    this.sectionBlockUI.start();
    this.telecomService.getAllTask(this.searchForm).subscribe(res => {
      this.isLoading = false; // Enable the button
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, (err) => {
      this.isLoading = false; // Enable the button even on error
      this.sectionBlockUI.stop();
      console.error(err);
    });
    this.telecomService.getSummary().subscribe(res => {
      this.sectionBlockUI.stop();
      this.summaryTask = res.data;
    })
  }

  getDetail(item) {
    if (item.detail) {
      try {
        return JSON.parse(item.detail);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Lưu note
   * 
   * @param content 
   * @returns 
   */
  async onSaveNote(content) {
    // Trim the content
    content = content?.trim();

    if (!content) {
      this.alertService.showMess("Vui lòng nhập nội dung");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý lưu lại")).value) {
      this.telecomService.saveNote({
        note: content,
        task_id: this.selectedItem.id
      }).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.getData();
        this.modalClose();
        this.alertService.showSuccess(res.message);
      }, err => {
        this.alertService.showMess(err);
      })
    }
  }

  copyTextClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.showSuccessToast("Đã copy thành công");
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

}
