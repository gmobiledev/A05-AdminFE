import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-history-topup',
  templateUrl: './history-topup.component.html',
  styleUrls: ['./history-topup.component.scss']
})
export class HistoryTopupComponent implements OnInit {

  public total: any;
  public list: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;

  maxToDate: string;

  public searchSim: any = {
    from: '',
    to: '',
    msisdn: ''
  };

  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,

  ) {

  }

  onFromDateChange() {
    if (this.searchSim.from) {
      const fromDate = new Date(this.searchSim.from);
      const maxDate = new Date(fromDate);
      maxDate.setDate(fromDate.getDate() + 30);
  
      const year = maxDate.getFullYear();
      const month = String(maxDate.getMonth() + 1).padStart(2, '0');
      const day = String(maxDate.getDate()).padStart(2, '0');
      this.maxToDate = `${year}-${month}-${day}`;
  
      if (this.searchSim.to && this.searchSim.to > this.maxToDate) {
        this.searchSim.to = this.maxToDate; // Reset 'to' date if it exceeds max
      }
    }
  }
  

  onSubmitSearch() {
    if (!this.searchSim.from || !this.searchSim.to) {
      this.alertService.showMess("Vui lòng chọn ngày tháng!");
      return;
    }
    if (!this.searchSim.msisdn) {
      this.alertService.showMess("Vui lòng nhập STB!");
      return;
    }

    this.telecomService.getBalanceTopupSimDVKH(this.searchSim.msisdn, this.searchSim).subscribe(res => {
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

function moment(from: any) {
  throw new Error('Function not implemented.');
}


