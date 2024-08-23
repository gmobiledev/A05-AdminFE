import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-trans-history',
  templateUrl: './trans-history.component.html',
  styleUrls: ['./trans-history.component.scss']
})
export class TransHistoryComponent implements OnInit {

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

  ) {
  }
  onSubmitSearch() {
    this.telecomService.getBalanceChangeSimDVKH(this.searchSim.msisdn, this.searchSim).subscribe(res => {
      this.itemBlockUI.stop();
      if (res.data && Object.keys(res.data).length > 0) {
        this.showMessage = false;
        this.list = res.data;
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
    
  }
  getData(): void {

  }

}

