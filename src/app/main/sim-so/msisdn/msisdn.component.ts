import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { STORAGE_KEY, TaskTelecom, MsisdnStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'environments/environment';
import { AdminService } from 'app/auth/service/admin.service';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import dayjs from 'dayjs';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-msisdn',
  templateUrl: './msisdn.component.html',
  styleUrls: ['./msisdn.component.scss']
})
export class MsisdnComponent implements OnInit {

  @Input() service: string;
  private myUrl = "/sim-so/msisdn"

  public contentHeader: any = {
    headerTitle: 'Số điện thoại đã đăng ký',
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
          name: 'Số điện thoại đã đăng ký',
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
    mno: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    page_size: 20,
    date_range: ''
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

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private gtalkService: GtalkService,
    private alertService: SweetAlertService,
    private telecomService: TelecomService
  ) {
    this.dateRange = null;
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(MsisdnStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = MsisdnStatus[key];
        return obj;
      }, {});

      this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      this.initActiveBoxSummary();
      if (this.searchForm.action && this.searchForm.array_status.length > 0) {
        this.setActiveBoxSummary(this.searchForm.array_status, this.searchForm.action);
      }

      this.contentHeader.headerTitle = 'Đơn & Topup';
      this.contentHeader.breadcrumb.links[1] = 'Đơn & Topup';

      this.getData();
    })

    if (this.service == "gtalk") {
      this.myUrl = "/gtalk/msisdn"
    }

  }

  async modalOpen(modal, item = null) {
    this.itemBlockUI.start();
    this.selectedItem = item;
    this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }
  async modalViewAgentOpen(modal, item = null) {
    if (item) {
      this.itemBlockUI.start();

      try {
        let res = await this.gtalkService.taskViewAgent(item);
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


  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }

  viewDetailSummary(array_status, action) {
    this.searchForm.action = action;
    this.searchForm.array_status = array_status;
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
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
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    this.searchForm.mine = this.mineTask ? 1 : '';
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    if (this.service == "gtalk") {
      this.gtalkService.exportExcelReport(this.searchForm).subscribe(res => {
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
      })
    } else {
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
      })
    }
  }
  onUpdateStatusSuccess(eventData: { updated: boolean }) {
    if (eventData.updated) {
      this.getData();
      // this.modalRef.close();
    }
  }

  ngOnInit(): void {
  }


  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (this.service == "gtalk") {
      this.gtalkService.getAllMsisdn(this.searchForm).subscribe(res => {
        this.list = res.data.items;
        this.totalItems = res.data.count;
      });
    } else {
      this.telecomService.getAllMsisdn(this.searchForm).subscribe(res => {
        this.list = res.data.items;
        this.totalItems = res.data.count;
      });
    }
  }

}