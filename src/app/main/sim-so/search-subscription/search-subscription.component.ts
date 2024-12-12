import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-search-subscription',
  templateUrl: './search-subscription.component.html',
  styleUrls: ['./search-subscription.component.scss']
})

export class SearchSubscriptionComponent implements OnInit {
  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;
  public totalItems: number;

  public searchSim: any = {
    id_no: '',
    name: ''
  }

  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private userService: UserService,
    private modalService: NgbModal,

  ) {

    this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = TaskTelecomStatus[key];
      return obj;
    }, {});
  }

  onSubmitSearch() {
    // Trim id_no and name to remove leading and trailing whitespaces
    this.searchSim.id_no = this.searchSim.id_no.trim();
    this.searchSim.name = this.searchSim.name.trim();
  
    // Check if both id_no and name are empty
    if (!this.searchSim.id_no && !this.searchSim.name) {
      this.alertService.showMess("Vui lòng nhập thông tin tìm kiếm!");
      return;
    }
  
    this.telecomService.searchSubscription({
      id_no: this.searchSim.id_no,
      name: this.searchSim.name
    }).subscribe(
      res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.item = res.data.items;
        this.totalItems = res.data.count;
        this.showMessage = this.item.length === 0;
      }, 
      err => {
        this.showMessage = true;
      }
    );
  }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }

  async onSubmitLock(id, status, name) {

    let confirmMessage: string;

    if (status == 2) {
      confirmMessage = "Bạn có đồng ý mở khóa " + name + "?";
    } else {
      confirmMessage = "Bạn có đồng ý khóa " + name + "?";
    }
  }


  async modalOpen(modal, item) {
    if (item) {
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });

    }
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }

}
