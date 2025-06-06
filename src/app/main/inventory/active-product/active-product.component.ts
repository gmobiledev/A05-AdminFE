import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ProductConstant, ProductStatus, ProductStoreStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'environments/environment';
import { AdminService } from 'app/auth/service/admin.service';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import dayjs from 'dayjs';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateAgentDto, CreateAgentServiceDto, CreateUserDto, UpdateStatusAgentDto } from 'app/auth/service/dto/user.dto';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonService } from 'app/utils/common.service';

@Component({
  selector: 'app-active-product',
  templateUrl: './active-product.component.html',
  styleUrls: ['./active-product.component.scss']
})
export class ActiveProductComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Danh sách số đã sử dụng',
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
          name: 'Danh sách số đã sử dụng',
          isLink: false
        }
      ]
    }
  };

  public list: any;
  public totalItems: number;
  public summaryTask: any;

  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus;
  public taskTelecomStatusSIM;
  public currentUser: any;
  public channel_id;
  public searchForm: any = {
    name: '',
    level: '',
    status: '',
    page_size: 20,
    page: 1,
  }
  public showChannel;

  public modalRef: any;
  public type: any;

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,    
    private inventoryService: InventoryService,
    private commonService: CommonService,
    private alertService: SweetAlertService

  ) {
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(ProductStoreStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {                        
        if([ProductStoreStatus.STATUS_AVAILABLE, ProductStoreStatus.STATUS_EXPORTED, ProductStoreStatus.STATUS_SOLD].includes(ProductStoreStatus[key])) {                    
          obj[key] = ProductStoreStatus[key];
        }
        return obj;  
        
      }, {});

      this.taskTelecomStatusSIM = ProductConstant.HANG_SO_THUE_BAO

      this.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.level = params['level'] && params['level'] != undefined ? params['level'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.page_size = params['page_size'] && params['page_size'] != undefined ? params['page_size'] : 20;

      this.getData();

    })

  }
  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    this.getData();
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/view-detail-totalSell'], { queryParams: this.searchForm });
  }

  ngOnInit(): void {
    // this.getData()
  }


  getData() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sectionBlockUI.start();

    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.page_size;
    this.inventoryService.getAllSimSO(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    });

  }

  async exportExcelByLocal() {
    this.sectionBlockUI.start();
    this.inventoryService.getAllProductStore(this.searchForm).subscribe(async res => {
      let data: any = res.data.items;
      await this.commonService.downloadFile(data, 'danh sach', ['name',  'brand', 'level',  'price', 'status'])
      this.sectionBlockUI.stop();
    }, error => {
      this.sectionBlockUI.stop();
      this.alertService.showMess(error);
      console.log("ERRRR");
      console.log(error);
    })
  }

  modalChannelOpen(modal, item) {
    if (item) {
      let params = {
        channel_id: item.id,
        current_sell_channel_id: this.searchForm.channel_id
      }
      this.inventoryService.viewDetailSell(item.sub_channel_id).subscribe(res => {
        this.showChannel = res.data.items[0];

        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'sm'
        });

      })
    }
  }

  modalClose() {    
    this.modalRef.close();
  }

}

