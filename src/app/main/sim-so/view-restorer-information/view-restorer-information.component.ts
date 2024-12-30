import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-view-restorer-information',
  templateUrl: './view-restorer-information.component.html',
  styleUrls: ['./view-restorer-information.component.scss']
})
export class ViewRestorerInformationComponent implements OnInit {
  @Input() data: any;
  @BlockUI('section-block') itemBlockUI: NgBlockUI;
  @Output() closePopup = new EventEmitter<boolean>();

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
  }

  timeStamp(time) {
    const myDate = time?.split("-");
    const newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
    const timeStamp = Math.floor(newDate.getTime() / 1000);
    return timeStamp;
  }

  submit() {
    const data = {
      task_id: this.data.task_id,
      identification_type: this.data.type,
      name: this.data.name,
      identification_no: this.data.id,
      birth: this.timeStamp(this.data?.dob),
      gender: this.data.sex,
      country: this.data.nationality,
      home_country: this.data.nationality,
      home_province: parseInt(this.data.address_entities.province_code),
      home_district: parseInt(this.data.address_entities.district_code),
      home_commune: parseInt(this.data.address_entities.ward_code),
      residence_province: parseInt(this.data.address_entities.province_code),
      residence_district: parseInt(this.data.address_entities.district_code),
      residence_commune: parseInt(this.data.address_entities.ward_code),
      residence_address: this.data.address,
      identification_expire_date: this.timeStamp(this.data.doe),
      identification_date: this.timeStamp(this.data.issue_date),
      identification_place: this.data.issue_loc,
      full_address: this.data.address
    }

    this.itemBlockUI.start();
    this.telecomService.postSubmitRecoverySim(data).subscribe(res => {
      if (res.status === 1) {
        this.closePopup.next();
        this.alertService.showMess(res.message);
      } else {
        this.alertService.showMess(res.message);
      };
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }
}
