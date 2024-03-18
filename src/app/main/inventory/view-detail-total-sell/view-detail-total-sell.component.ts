import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
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

  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus;
  public selectedItem: any;
  public selectedAgent: any;
  public mineTask = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public mnos: any = []
  public listSellUser: any;

  public searchForm: any = {
    name: '',
    level: '',
    status: '',
    page_size: 1,
    page: 1,
  }

  public modalRef: any;

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

      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.level = params['level'] && params['level'] != undefined ? params['level'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.page_size = params['page_size'] && params['page_size'] != undefined ? params['page_size'] : 1;

      this.contentHeader.headerTitle = 'Xem chi tiết kho tổng';
      this.contentHeader.breadcrumb.links[1] = 'Xem chi tiết kho tổng';


    })

  }


  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/view-detail-totalSell'], { queryParams: this.searchForm });
  }



  onSubmitSearch() {
    // this.searchForm.page = this.mineTask ? 1 : '';
    this.router.navigate(['/inventory/view-detail-totalSell'], { queryParams: this.searchForm });
  }

  ngOnInit(): void {
    this.getData()
  }


  getData() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sectionBlockUI.start();
    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.page_size;
    this.inventoryService.getAllSimSO(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data;
      this.totalItems = res.data.count;
    });

  }

}

