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

  public listeSim: any;
  public listSim: any;


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
  
  onSubmit(type) {
    if (!this.dataPost.serial || !this.dataPost.package) {
      this.alertService.showMess("Vui lòng chọn Xem chi tiết eSIM/SIM và nhập STB/Serial!");
      return;
    }
  
    if (type == 1) {
      this.telecomService.getInfoeSimDVKH(this.dataPost).subscribe(res => {
        if (res.status == 1) {
          this.listeSim = res.data
        }
      }, err => {
        this.alertService.showMess(err);
        this.listeSim = null
      });
    } else {
      this.telecomService.getInfoSimDVKH(this.dataPost).subscribe(res => {
        if (res.status == 1) {
          this.listeSim = res.data
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


