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

@Component({
  selector: 'app-view-detail-total-sell',
  templateUrl: './view-detail-total-sell.component.html',
  styleUrls: ['./view-detail-total-sell.component.scss']
})
export class ViewDetailTotalSellComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Danh sách sim số',
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
          name: 'Danh sách kho',
          isLink: true,
          link: '/inventory/sell-chanel'
        },
        {
          name: 'Danh sách sim số',
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


  ) {
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(ProductStoreStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {                
        if([ProductStoreStatus.STATUS_AVAILABLE, ProductStoreStatus.STATUS_EXPORTED, ProductStoreStatus.STATUS_SOLD].includes(obj[key])) {
          obj[key] = ProductStoreStatus[key];
          return obj;  
        }
        
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


  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/view-detail-totalSell'], { queryParams: this.searchForm });
  }


  onSubmitSearch() {
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

