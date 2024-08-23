import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {

  public total: any;
  public list: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;

  public searchSim: any = {
    msisdn: '',
    from: '',
    to: '',
    type: '',
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
    console.log(this.searchSim);
    this.itemBlockUI.start();
    this.telecomService.getBalanceChangeSimDVKH(this.searchSim.msisdn, this.searchSim).subscribe(res => {
      this.itemBlockUI.stop();
      if (res.data && Object.keys(res.data).length > 0) {
        this.showMessage = false;
        this.list = res.data;
        // this.total = res.data.count;
      } else if (!res.data || Object.keys(res.data).length === 0) {
        this.list = null
        this.showMessage = true;
      }

    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }


  getInvenstory(){
    return this.list?.sell_channels ? this.list.sell_channels.map(x=>x.channel.name).join("-") : ""
  }

}

