import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-way-lock',
  templateUrl: './way-lock.component.html',
  styleUrls: ['./way-lock.component.scss']
})

export class WayLockComponent implements OnInit {
  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;
  public totalItems: number;

  public searchSim: any = {
    mobile: '',
    message: ''
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
    // this.itemBlockUI.start();
    this.telecomService.searchSubscription({
      id_no: this.searchSim.id_no,
      name: this.searchSim.name
    }).subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.item = res.data.items;
      this.totalItems = res.data.count;
      this.showMessage = false;
      // this.alertService.showSuccess(res.message);
    }, err => {
      // this.alertService.showMess(err);
      this.showMessage = true;
    })

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
  }

  async onSubmitLock(type) {

    let titleS;
    if (type == 1) {
      titleS = "Bạn có đồng ý khóa chiều đi ?";
    }
    if (type == 2) {
      titleS = "Bạn có đồng ý khóa chiều đến ?";
    }
    if (type == 3) {
      titleS = "Bạn có đồng ý mở khóa 1C không ?";
    }
    if (type == 4) {
      titleS = "Bạn có đồng ý mở khóa 2C không ?";
    }

    Swal.fire({
      title: titleS,
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Gửi',
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        if (!note || note == '') {
          Swal.showValidationMessage(
            "Vui lòng nhập nội dung"
          )
          return;
        }
        this.searchSim.message = note;

        this.telecomService.lockOneWay(this.searchSim, type).subscribe(res => {
          if (!res.status) {
            Swal.showValidationMessage(
              res.message
            )
            this.getData();
            return;
          }
          this.alertService.showSuccess(res.message);
          // this.modalClose();
          this.getData();
        }, error => {
          Swal.showValidationMessage(
            error
          )
          this.alertService.showMess(error);

        });


      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
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
