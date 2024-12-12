import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-search-package',
  templateUrl: './search-package.component.html',
  styleUrls: ['./search-package.component.scss']
})
export class SearchPackageComponent implements OnInit {
  public searchSim: any = {
    mobile: '',
  };
  public item: any;
  public taskTelecomStatus;
  public showMessage: boolean;
  @BlockUI('section-block') itemBlockUI: NgBlockUI;
  
  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
  ) { 
    this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = TaskTelecomStatus[key];
      return obj;
    }, {});
  }

  ngOnInit(): void {
  }

  formatNumber(number: string): string {
    return number.replace(/[^\d]/g, "");
  }

  onInputChange() {
      this.searchSim.mobile = this.formatNumber(this.searchSim.mobile);
  }

  formatDatax(data: number): string {
    if (data >= 1024**3) {
      return (data / 1024 ** 3).toFixed(1) + " GB";
    } else {
      return data + " MB";
    }
  }

  formatCall(data: number): string {
      return (data / 60).toFixed(0);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' đ';
  }

  onSubmitSearch() {
    console.log(this.searchSim);
    this.itemBlockUI.start();
    this.telecomService.postSearchPackage(this.searchSim).subscribe(res => {
      this.itemBlockUI.stop();
      if (res.data && Object.keys(res.data).length > 0) {
        this.showMessage = false;
        this.item = res.data
        console.log(this.item);
      } else if (!res.data || Object.keys(res.data).length === 0) {
        this.item = null
        this.showMessage = true;
      }

    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }

}
