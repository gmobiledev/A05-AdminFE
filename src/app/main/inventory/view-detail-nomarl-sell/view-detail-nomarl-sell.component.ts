import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ProductConstant, ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
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
  selector: 'app-view-detail-nomarl-sell',
  templateUrl: './view-detail-nomarl-sell.component.html',
  styleUrls: ['./view-detail-nomarl-sell.component.scss']
})
export class ViewDetailNomarlSellComponent implements OnInit {

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
          name: 'Danh sách sim số',
          isLink: false
        }
      ]
    }
  };
  public list: any;
  public totalItems: number;

  public taskTelecomStatus;
  public taskTelecomStatusSIM;
  public currentUser: any;

  public searchFormJunior: any = {
    keysearch: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    skip: 0,
    take: 20,
    date_range: '',
    telco: '',
    channel_id: '',
    batch_id: '',
    keyword: '',
    level: ''
  }

  public modalRef: any;
  public type: any;

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private adminService: AdminService,
    private gtalkService: GtalkService,
    private authenticaionService: AuthenticationService,
    private alertService: SweetAlertService,
    private inventoryService: InventoryService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private telecomService: TelecomService,


  ) {
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = Object.keys(ProductStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = ProductStatus[key];
        return obj;
      }, {});

      this.taskTelecomStatusSIM = ProductConstant.HANG_SO_THUE_BAO
      this.searchFormJunior.keysearch = params['keysearch'] && params['keysearch'] != undefined ? params['keysearch'] : '';
      this.searchFormJunior.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchFormJunior.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchFormJunior.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchFormJunior.batch_id = params['batch_id'] && params['batch_id'] != undefined ? params['batch_id'] : '';
      this.searchFormJunior.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchFormJunior.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.searchFormJunior.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchFormJunior.page = params['page'] && params['page'] != undefined ? params['page'] : 1;

      this.getData();

    })

  }


  loadPage(page) {
    this.searchFormJunior.page = page;
    this.router.navigate(['/inventory/view-detail-nomarlSell'], { queryParams: this.searchFormJunior });
  }


  onSubmitSearch() {
    this.router.navigate(['/inventory/view-detail-nomarlSell'], { queryParams: this.searchFormJunior });
  }

  ngOnInit(): void {
    // this.getData()
  }


  getData() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sectionBlockUI.start();
    this.searchFormJunior.skip = (this.searchFormJunior.page - 1) * this.searchFormJunior.take;
    this.inventoryService.getAllSim(this.searchFormJunior).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.data.items;
      this.totalItems = res.data.data.count;
    });
  }

}

