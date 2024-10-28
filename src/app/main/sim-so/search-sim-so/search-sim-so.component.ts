import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-sim-so',
  templateUrl: './search-sim-so.component.html',
  styleUrls: ['./search-sim-so.component.scss']
})
export class SearchSimSoComponent implements OnInit {
  ProductStatus = ProductStatus;
  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;

  public searchSim: any = {
    keysearch: '',
    category_id: 2,
    take: 10,
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
    this.telecomService.getDetailSim(this.searchSim).subscribe(res => {
      this.itemBlockUI.stop();
      if (res.data && Object.keys(res.data).length > 0) {
        this.showMessage = false;
        this.item = res.data
        this.total = res.data.count;
      } else if (!res.data || Object.keys(res.data).length === 0) {
        this.item = null
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

  async onSubmitLock(id, status, name) {

    let confirmMessage: string;

    if (status == 2) {
      confirmMessage = "Bạn có đồng ý mở khóa " + name + "?";
    } else {
      confirmMessage = "Bạn có đồng ý khóa " + name + "?";
    }

    // if ((await this.alertService.showConfirm(confirmMessage)).value) {
    //   this.userService.lockUser(id, status, "").subscribe(res => {
    //     if (!res.status) {
    //       this.alertService.showError(res.message);
    //       return;
    //     }
    //     this.alertService.showSuccess(res.message);
    //     this.getData();
    //   }, err => {
    //     this.alertService.showError(err);
    //   })
    // }
  }

  async onNote() {

    Swal.fire({
      title: 'Mở bán sim số',
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
        const data = {
          message: note,
          mobile: this.searchSim.keysearch
        }
        console.log(data);

        this.telecomService.note(data).subscribe(res => {
          if (!res.status) {
            Swal.showValidationMessage(
              res.message
            )
            this.onSubmitSearch();
            return;
          }
           this.onSubmitSearch();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);

        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }

  getInvenstory(){
    let textWarehouseNumber = this.item?.sell_channels ? this.item.sell_channels.map(x=>x.channel.name).join("-") : "";
    if(this.item?.nearest_channel){
      textWarehouseNumber = textWarehouseNumber + ' - ' + this.item?.nearest_channel?.code;
    };
    return textWarehouseNumber;
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