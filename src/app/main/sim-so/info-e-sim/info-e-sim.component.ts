import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-info-e-sim',
  templateUrl: './info-e-sim.component.html',
  styleUrls: ['./info-e-sim.component.scss']

})
export class InfoESimComponent implements OnInit {

  public listStatus: any;
  public listeSim: any;


  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private userService: UserService,
    private modalService: NgbModal,

  ) {

  }

  dataPost = {
    serial: "",
    package: "",
  }

  checkStatus() {
    this.telecomService.getInfoeSimDVKH(this.dataPost).subscribe(res => {
      if (res.status == 1) {
        this.listStatus = res.data.status
        if (this.listStatus == "1") {
          this.listStatus = "1: sẵn sàng sử dụng"
        } else if (this.listStatus == "4") {
          this.listStatus = "4: đã sử dụng"
        } else if (this.listStatus == "NOT-SSSD: Không sẵn sàng sử dụng") {
          this.listStatus = "NOT-SSSD: Không sẵn sàng sử dụng"
        } else if (this.listStatus == "SSSD: Sẵn sàng sử dụng") {
          this.listStatus = "SSSD: Sẵn sàng sử dụng"
        }
      }
    }, err => {
      this.alertService.showMess(err);
      this.listStatus = null
    });
  }

  onSubmit(type) {
    if (!this.dataPost.serial || !this.dataPost.package) {
      this.alertService.showMess("Vui lòng chọn Xem chi tiết eSIM/SIM và nhập STB/Serial!");
      return;
    }
    if (type == 1) {
      this.telecomService.getInfoeSimDVKH(this.dataPost).subscribe(res => {
        if (res.status == 1) {
          this.listeSim = res.data

          this.listStatus = res.data.status
          if (this.listStatus == "1") {
            this.listStatus = "Sẵn sàng sử dụng"
          } else if (this.listStatus == "4") {
            this.listStatus = "Đã sử dụng"
          }

        }
      }, err => {
        this.alertService.showMess(err);
        this.listeSim = null
      });
    } else {
      this.telecomService.getInfoSimDVKH(this.dataPost).subscribe(res => {
        if (res.status == 1) {
          this.listeSim = res.data

          this.listStatus = res.data.status
          if (this.listStatus == "NOT-SSSD") {
            this.listStatus = "Không sẵn sàng sử dụng"
          } else if (this.listStatus == "SSSD") {
            this.listStatus = "Sẵn sàng sử dụng"
          }

        }
      }, err => {
        this.alertService.showMess(err);
        this.listeSim = null
      });
    }
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {

  }

}


