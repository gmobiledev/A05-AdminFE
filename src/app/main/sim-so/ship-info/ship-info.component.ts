import { Component, Input, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-ship-info',
  templateUrl: './ship-info.component.html',
  styleUrls: ['./ship-info.component.scss']
})
export class ShipInfoComponent implements OnInit {

  @Input() item;
  public detail;
  public ship_tracking;

  constructor(
    private alertService: SweetAlertService,
    private telecomService: TelecomService
  ) { }

  ngOnInit(): void {
    if(this.item) {
      this.detail = JSON.parse(this.item.detail);
      if(this.detail['ship_tracking']) {
        this.ship_tracking = this.detail['ship_tracking'];
      }
    }    
  }

  copyTextClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.showSuccessToast("Đã copy thành công");
  }

  async onSubmitShipTracking() {
    
    if ((await this.alertService.showConfirm("Vừa thực hiện thay đổi, bạn có đồng ý lưu lại")).value) {
      if(!this.ship_tracking || this.ship_tracking == undefined) {
        this.alertService.showMess("Vui lòng nhập link");
        return;
      }

      this.telecomService.submitShipTracking({
        ship_tracking: this.ship_tracking,
        task_id: this.item.id
      }).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
      }, err => {
        this.alertService.showMess(err);
      })
    }  
  }

}
