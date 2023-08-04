import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'environments/environment';
import { AdminService } from 'app/auth/service/admin.service';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken  } from "firebase/messaging";
import dayjs from 'dayjs';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListTaskComponent implements OnInit {

  public contentHeader: any =  {
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
    cccd: ''
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
    private adminService: AdminService,
    private telecomService: TelecomService,
    private authenticaionService: AuthenticationService,
    private alertService: SweetAlertService
  ) {
    this.dateRange = null;
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = TaskTelecomStatus[key];
        return obj;
      }, {});
      
      this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.cccd = params['cccd'] && params['cccd'] != undefined ? params['cccd'] : '';
      this.searchForm.customer_name = params['customer_name'] && params['customer_name'] != undefined ? params['customer_name'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.mine = params['mine'] && params['mine'] != undefined ? params['mine'] : '';
      this.searchForm.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      this.searchForm.array_status = params['array_status'] && params['array_status'] != undefined ? params['array_status'] : [];
      this.initActiveBoxSummary();
      if(this.searchForm.action && this.searchForm.array_status.length > 0) {
        this.setActiveBoxSummary(this.searchForm.array_status, this.searchForm.action);
      }
      if(!this.searchForm.action) {
        this.contentHeader.headerTitle = 'Yêu cầu của đại lý';
        this.contentHeader.breadcrumb.links[1] = 'Yêu cầu của đại lý';
      }else if(this.searchForm.action && this.searchForm.action == this.listTaskAction.change_info.value) {
        this.contentHeader.headerTitle = 'Yêu cầu đổi sim của đại lý';
        this.contentHeader.breadcrumb.links[1] = 'Yêu cầu đổi sim của đại lý';
      } else if (this.searchForm.action && this.searchForm.action == this.listTaskAction.new_sim.value) {
        this.contentHeader.headerTitle = 'Yêu cầu đấu sim mới của đại lý';
        this.contentHeader.breadcrumb.links[1] = 'Yêu cầu đấu sim mới của đại lý';
      }
      this.getData();
    })
    
  }

  async modalOpen(modal, item = null) { 
    if(item) {
      let check;
      //neu la task dau noi cho KH doanh nghiep, chuyen sang trang moi
      if(item.customer_id && item.customer_type == 'ORGANIZATION') {
        if(item.status == TaskTelecomStatus.STATUS_NEW_ORDER) {
          try {
            check = await this.telecomService.checkAvailabledTask(item.id);
            if(!check.status) { 
              this.getData();
              this.alertService.showMess(check.message); 
              return;              
            }
            this.itemBlockUI.stop();
            this.router.navigateByUrl('/sim-so/task/'+item.id);
          } catch (error) {
            this.itemBlockUI.stop();
            return;
          }
        } else {
          this.router.navigateByUrl('/sim-so/task/'+item.id);
        }
        return;
      }
      this.itemBlockUI.start();
      this.selectedItem = item;
      
      if(item.status != this.taskTelecomStatus.STATUS_CANCEL && item.status != this.taskTelecomStatus.STATUS_SUCCESS) {
        try {
          check = await this.telecomService.checkAvailabledTask(item.id);
          if(!check.status) { 
            this.getData();
            this.alertService.showMess(check.message); 
            // if(!this.isAdmin) {                         
            //   return;
            // }           
            
          }
          this.itemBlockUI.stop();
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'xl',
            backdrop : 'static',
            keyboard : false
          });
        } catch (error) {
          this.itemBlockUI.stop();
          return;
        }
      } else {
        this.itemBlockUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'xl',
          backdrop : 'static',
          keyboard : false
        });
      }
      
      
    }
  }

  async modalApprovalOpen(modal, item = null) { 
    if(item) {     
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'xl',
        backdrop : 'static',
        keyboard : false
      });            
    }
  }

  modalClose() {    
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();    
  }
  async modalViewAgentOpen(modal, item = null) { 
    if(item) {
      this.itemBlockUI.start();
      
        try {
          let res = await this.telecomService.taskViewAgent(item);
          if(!res.status) { 
            this.getData();
            this.alertService.showMess(res.message);
          }
          this.selectedAgent = res.data;
          this.itemBlockUI.stop();
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'sm',
            backdrop : 'static',
            keyboard : false
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
      if(!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.selectedItem = res.data;
      this.modalRef = this.modalService.open(modalToOpen, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'xl',
        backdrop : 'static',
        keyboard : false
      });
    })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/sim-so/task'], { queryParams: this.searchForm});
  }

  viewDetailSummary(array_status, action) {
    this.searchForm.action = action;
    this.searchForm.array_status = array_status;
    this.router.navigate(['/sim-so/task'], { queryParams: this.searchForm});
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
    if(action == this.listTaskAction.new_sim.value ) {
      if(JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER+""]) ) {
        this.isActivedBoxNewInit = true;
      }
      if(JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_PROCESSING+"", ""+this.taskTelecomStatus.STATUS_PROCESS_TO_MNO]) ) {
        this.isActivedBoxNewProcessing = true;
      }
    } else if (action == this.listTaskAction.change_info.value ) {
      if(JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_NEW_ORDER+""]) ) {
        this.isActivedBoxChangeSimInit = true;
      }
      if(JSON.stringify(array_status) == JSON.stringify([this.taskTelecomStatus.STATUS_PROCESSING+"", ""+this.taskTelecomStatus.STATUS_PROCESS_TO_MNO]) ) {
        this.isActivedBoxChangeSimProcessing = true;
      }
    }
  }

  showDate(date, timeZone, diff) {
    if(!date) {
      return '';
    }
    let dateConverted = new Date(date);
    dateConverted.setMinutes(new Date(date).getMinutes() + diff);
    return formatDate(dateConverted, 'dd/MM/yyyy H:mm', 'en-US', timeZone);
  }

  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    this.searchForm.mine = this.mineTask ? 1 : '';
    this.router.navigate(['/sim-so/task'], { queryParams: this.searchForm});
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
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
  onUpdateStatusSuccess(eventData: {updated: boolean}) {
    if(eventData.updated) {
      this.getData();
      // this.modalRef.close();
    }
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
    if(!isSub) {
      if(Notification.permission === 'default') {
        Notification.requestPermission().then(() => {
          this.setSubcribe();
        }).catch((error) => {
          console.log(error);        
        });
      }
      else if(Notification.permission === 'denied') {
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
    if(this.currentUser && this.currentUser.roles) {
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
    this.telecomService.getAllTask(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    });
    this.telecomService.getSummary().subscribe(res => {
      this.summaryTask = res.data;
    })
  }

}
