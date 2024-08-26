import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {

  public total: any;
  public list: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;

  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private userService: UserService,
    private modalService: NgbModal,

  ) {
    
  }

  dataPost = {
    msisdn: "",
    package: "",
  }

  onSubmit(){

    this.telecomService.postPackageSimDVKH(this.dataPost).subscribe(res => {
      if(res.status == 1){
        this.alertService.showSuccess(res.message);
      }
    }, err => {
      this.alertService.showMess(err);
    })
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.telecomService.getPackageSimDVKH().subscribe(res => {
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




}


