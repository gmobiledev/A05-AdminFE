import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { MsisdnStatus, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import JSZip from 'jszip';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskItemComponent implements OnInit {

  @Input() item: any;
  @Input() currentUserId: any;
  @Input() currentGPKD: any;
  @Input() typeDetail: any;
  @Input() currentUser: any;
  @Output() updateStatus = new EventEmitter<{ updated: boolean }>();
  @Output() createNewTask = new EventEmitter<any>();

  @ViewChild('modalUploadSim') modalUploadSim: ElementRef;
  
  public data: any;
  listCurrentAction: any;

  public taskTelecomStatus = TaskTelecomStatus;
  public listTaskAction = TaskTelecom.ACTION;
  public msisdnStatus = MsisdnStatus;
  public actionText = 'Đấu nối';
  public titleDocumentImage = 'Ảnh phiếu yêu cấu/hợp đồng';
  public titleModal = 'Đấu nối sim mới';
  public mnos: string[] = [];
  public linkShipTracking;

  simFile: any;
  public viewImage;
  public modalRef: any;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @BlockUI('modal-create-task') modalUploadSimBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private telecomService: TelecomService,
    private adminService: AdminService,
    private alertService: SweetAlertService
  ) {

  }

  /**
   * 
   * Phản hồi cho đại lý qua notify
   * 
   * @param item 
   */
  onSendMessage(item) {
    Swal.fire({
      title: 'Phản hồi cho đại lý',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Gửi',
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        const listPhone = this.data.msisdn.msisdns.length > 1 ? this.data.msisdn.msisdns.map(x => { return x.msisdn }).join('-') : this.data.msisdn.msisdns[0].msisdn;
        const dataPushNotify = {
          user_ids: [this.data.task.request_by],
          message: `${note}`,
          title: `${this.actionText} số ${listPhone}`,
          data: {
            "type": "TELECOM",
            "status": "",
            "message": `${note}`,
            "id": this.data.task.id + ""
          }
        }
        this.adminService.pushNotify(dataPushNotify).subscribe(res => {

        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.getData();
        // //this.updateStatus.emit({updated: true});
        this.alertService.showSuccess('Thành công');
      }
    })
  }
  /**
   * Cap nhat trang thai cua task
   * 
   * @param item 
   * @param status 
   */
  async onUpdateStatus(item, status) {
    if (status == this.taskTelecomStatus.STATUS_REJECT || status == this.taskTelecomStatus.STATUS_CANCEL) {
      let titleS;
      if (status == this.taskTelecomStatus.STATUS_REJECT) {
        titleS = 'Từ chối yêu cầu, gửi lý do cho đại lý'
      }
      if (status == this.taskTelecomStatus.STATUS_CANCEL) {
        titleS = 'Xác nhận hủy yêu cầu của đại lý?'
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
          this.telecomService.updateTaskStatus(item.id, { status: status, note: note }).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              // this.alertService.showError(res.message);
              return;
            }
          }, error => {

          });

          const listPhone = this.data.msisdn.msisdns.length > 1 ? this.data.msisdn.msisdns.map(x => { return x.msisdn }).join('-') : this.data.msisdn.msisdns[0].msisdn;
          const dataPushNotify = {
            user_ids: [this.data.task.request_by],
            message: `Yêu cầu ${this.actionText} ID ${this.data.task.id} bị từ chối: ${note}`,
            title: `${this.actionText} số ${listPhone}`,
            data: {
              "type": this.data.task.action,
              "status": status + "",
              "message": `Yêu cầu ${this.actionText} ID ${this.data.task.id} bị từ chối: ${note}`,
              "id": this.data.task.id + ""
            }
          }
          console.log(dataPushNotify);
          this.adminService.pushNotify(dataPushNotify).subscribe(res => {

          });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.getData();
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess('Thành công');
        }
      })
    } else {
      let confirmMessage = "";
      if (status == this.taskTelecomStatus.STATUS_PROCESSING) {

      } else if (status == this.taskTelecomStatus.STATUS_PROCESS_TO_MNO) {
        confirmMessage = "Xác nhận đã đẩy thông tin " + this.actionText + " sang nhà mạng?"
      } else if (status == this.taskTelecomStatus.STATUS_SUCCESS) {
        confirmMessage = "Xác nhận đã " + this.actionText + " thành công?"
      } else if (status == this.taskTelecomStatus.STATUS_SUCCESS_PART) {
        confirmMessage = "Xác nhận đã " + this.actionText + " thành công 1 phần?"
      }


      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.telecomService.updateTaskStatus(item.id, { status: status }).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            return;
          }
          if (status == this.taskTelecomStatus.STATUS_SUCCESS) {
            //this.updateStatus.emit({updated: true});
          }
          this.getData();
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess(res.message);
        }, error => {

        })
        if (status == this.taskTelecomStatus.STATUS_SUCCESS) {
          const listPhone = this.data.msisdn.msisdns.length > 1 ? this.data.msisdn.msisdns.map(x => { return x.msisdn }).join('-') : this.data.msisdn.msisdns[0].msisdn;
          const dataPushNotify = {
            user_ids: [this.data.task.request_by],
            title: `Yêu cầu ${this.actionText} ID ${this.data.task.id} đã thành công`,
            message: `${this.actionText} số ${listPhone}`,
            data: {
              "type": this.data.task.action,
              "status": status + "",
              "message": `Yêu cầu ${this.actionText} ID ${this.data.task.id} số ${listPhone} thành công, vui lòng nạp tiền và kích hoạt trong vòng 72h `,
              "id": this.data.task.id + ""
            }
          }
          console.log(dataPushNotify);
          this.adminService.pushNotify(dataPushNotify).subscribe(res => {

          });
        }
      }
    }

  }

  /**
   * Đồng bộ với nhà mạng khác
   */
  async asyncToMnoViaApi(item) {
    let confirmMessage = "Xác nhận đồng bộ thông tin"
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.sectionBlockUI.start();
      this.telecomService.asyncToMnoViaApi(item).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showError(res.message, 30000);
          return;
        }
        this.alertService.showSuccess(res.data.message,15000);
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showError(error,15000);
      })
    }
  }

  async sendCallback(item) {
    this.telecomService.sendCallback(item).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      this.alertService.showSuccess(res.message);
    }, error => {
      this.alertService.showError(error);

    })
  }

  /**
   * 
   * Cap nhat trang thai cua msisnd
   * @param item 
   * @param status 
   */
  async onUpdateStatusMsisdn(item, status) {
    let dataUpdateMsisdn = {
      msisdn_id: item.id,
      status: status,
      note: ''
    }
    if (status == this.msisdnStatus.STATUS_PROCESSED_MNO_FAIL) {
      Swal.fire({
        title: this.actionText + ' thất bại, đẩy lý do về cho đại lý',
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
          dataUpdateMsisdn.note = note;
          this.telecomService.updateMsisdnStatus(item.id, dataUpdateMsisdn).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              this.alertService.showError(res.message);
              return;
            }
            this.getData();
            //this.updateStatus.emit({updated: true});
            this.alertService.showSuccess('Thành công');
          }, error => {

          });
          const dataPushNotify = {
            user_ids: [this.data.task.request_by],
            message: `${this.actionText} thất bại: ${note}`,
            title: `${this.actionText} số ${item.msisdn}`,
            data: {
              "type": this.data.task.action,
              "status": status + "",
              "message": `${this.actionText} số ${item.msisdn} thất bại: ${note} lý do: ${note}`,
              "id": this.data.task.id + ""
            }
          }
          this.adminService.pushNotify(dataPushNotify).subscribe(res => {

          });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {

        }
      })
    } else {
      let confirmMessage = "Xác nhận đã " + this.actionText + " thành công?";

      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.telecomService.updateMsisdnStatus(item.id, dataUpdateMsisdn).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            return;
          }
          //this.updateStatus.emit({updated: true});
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {

        })
        if (status == this.msisdnStatus.STATUS_PROCESSED_MNO_SUCCESS) {
          const dataPushNotify = {
            user_ids: [this.data.task.request_by],
            message: `${this.actionText} thành công`,
            title: `${this.actionText} số ${item.msisdn}`,
            data: {
              "type": this.data.task.action,
              "status": status + "",
              "message": `${this.actionText} số ${item.msisdn} thành công`,
              "id": this.data.task.id + ""
            }
          }
          this.adminService.pushNotify(dataPushNotify).subscribe(res => {

          });
        }
      }
    }

  }

    /**
   * Duyệt chuyển đổi 2G
   * 
   * @param item 
   * @param status 
   */
    async onUpdateStatus2G(item, status) {
      if (status == this.taskTelecomStatus.STATUS_CANCEL) {
        let titleS;
        if (status == this.taskTelecomStatus.STATUS_CANCEL) {
          titleS = 'Không duyệt, gửi lại lý do'
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
            this.telecomService.conversion2GApprove({task_id: item.id, status: status, note: note }).subscribe(res => {
              if (!res.status) {
                Swal.showValidationMessage(
                  res.message
                )
                // this.alertService.showError(res.message);
                return;
              }
            }, error => {
              this.alertService.showMess(error);
            });          
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            this.getData();
            this.alertService.showSuccess('Thành công');
          }
        })
      } else {
        let confirmMessage = "Xác nhận duyệt?";        
        if ((await this.alertService.showConfirm(confirmMessage)).value) {
          this.telecomService.conversion2GApprove({task_id: item.id, status: status }).subscribe(res => {
            if (!res.status) {
              this.alertService.showError(res.message);
              return;
            }
            if (status == this.taskTelecomStatus.STATUS_SUCCESS) {
            }
            this.getData();
            this.alertService.showSuccess(res.message);
          }, error => {
            this.alertService.showMess(error);
          })
        }
      }
    }
  
  /**
   * Nhập số serial để tạo task new_sim
   * 
   * @param item 
   * @param serial 
   */
  onUploadSimInfo(item) {
    this.modalRef = this.modalService.open(this.modalUploadSim, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg',
      backdrop : 'static',
      keyboard : false
    });
  }

  onCloseModal() {
    this.modalRef.close();
  }

  async onSelectFile(event, file_type) {
    if(event.target.files && event.target.files[0]) {
      this.simFile = event.target.files[0]
    }    
  }

  /**
   * Nhập serial, tải ảnh sim tạo task
   * 
   * @param serial 
   * @returns 
   */
  async onSubmitUploadSimInfo(serial) {
    let data = new FormData();
    if(!serial || serial == undefined) {
      this.alertService.showMess("Vui lòng nhập số serial");
      return;
    }
    data.append("task_id", this.item.id);
    data.append("serial", serial);
    data.append("sim_image", this.simFile);
    if ((await this.alertService.showConfirm("Bạn có đồng ý lưu lại")).value) {
      this.modalUploadSimBlockUI.start();
      this.telecomService.uploadSimInfo(data).subscribe(res => {
        this.modalUploadSimBlockUI.stop();
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.onCloseModal();
        this.createNewTask.emit(res.data);
      }, err => {
        this.alertService.showMess(err);
      })
    }    
  }

  onModalShipOpen(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg',
      backdrop : 'static',
      keyboard : false
    });
  }

  /**
   * Lưu link tracking
   * 
   * @param link 
   * @returns 
   */
  async onSubmitShipTracking(link) {
    if(!link || link == undefined) {
      this.alertService.showMess("Vui lòng nhập link");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý lưu lại")).value) {
      this.telecomService.submitShipTracking({
        ship_tracking: link,
        task_id: this.item.id
      }).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.getData();
        this.onCloseModal();
        this.alertService.showSuccess(res.message);
      }, err => {
        this.alertService.showMess(err);
      })
    }  
  }

  onDownloadImages() {
    var zip = new JSZip();
    if (this.data.task.action == this.listTaskAction.new_sim.value) {
      for (const key in this.data?.msisdn?.base64SimFile) {
        let images = [];
        images = [
          {
            name: '__anh_giay_to_mat_truoc.jpg',
            data: this.data?.customer.people?.identification_front_file
          },
          {
            name: '__anh_giay_to_mat_sau.jpg',
            data: this.data?.customer.people?.identification_back_file
          },
          {
            name: '__anh_phieu_yeu_cau_hop_dong.jpg',
            data: this.data?.task?.identification_back_file
          },
          {
            name: '__anh_chu_ky.jpg',
            data: this.data?.customer.people?.identification_signature_file
          },
          {
            name: '__anh_khuon_mat.jpg',
            data: this.data?.customer.people?.identification_selfie_file
          }
        ]
        if(this.currentGPKD) {
          images.push({
            name: key + '_GPKD.jpg',
            data: this.currentGPKD
          });
        }
        const zipFileName = `Đấu sim mới ${this.data.people.name}_${key}`;
        const dataD = this.data?.msisdn?.base64SimFile[key];
        images.push({
          name: key + '_anh_the_sim.jpg',
          data: dataD
        });
        this.compressImages(images, zipFileName);
      }
    } else if (this.data.task.action == this.listTaskAction.change_info.value) {

      for (const key in this.data?.msisdn?.listBase64NewSim) {
        let images = [];
        images = [
          {
            name: '__anh_giay_to_mat_truoc.jpg',
            data: this.data?.people?.base64FrontCompare
          },
          {
            name: '__anh_giay_to_mat_sau.jpg',
            data: this.data?.people?.base64BackCompare
          },
          {
            name: '__anh_phieu_yeu_cau_hop_dong.jpg',
            data: this.data?.task?.document_image
          },
          {
            name: '__anh_chu_ky.jpg',
            data: this.data?.people?.base64SignatureCompare
          },
          {
            name: '__anh_khuon_mat.jpg',
            data: this.data?.people?.base64SelfieCompare
          }
        ]
        const zipFileName = `Đối sim ${this.data.people.name}_${key}`;
        const dataD = this.data?.msisdn?.listBase64NewSim[key];
        images.push({
          name: key + '_anh_the_sim.jpg',
          data: dataD
        });
        this.compressImages(images, zipFileName);
      }
    }

  }

  compressImages(urls, folderName) {
    var zip = new JSZip();
    var ctx = this;
    var count = 0;
    var fileName = folderName + ".zip";
    urls.forEach(function (item) {

      zip.file(folderName + '/' + item.name, item.data, {
        base64: true
      });
      count++;
      if (count == urls.length) {
        zip.generateAsync({
          type: 'blob'
        }).then(function (content) {
          ctx.downloadFile(content, fileName);
        });
      }

    })
  }

  downloadFile(data, filename) {
    const element = document.createElement("a");
    element.setAttribute("href", window.URL.createObjectURL(data));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onViewImage(modal, type, mobile = null) {
    if (type == 'cccd_front') {
      this.viewImage = 'data:image/png;base64,' + this.data.customer.people.identification_front_file
    }
    if (type == 'cccd_back') {
      this.viewImage = 'data:image/png;base64,' + this.data.customer.people.identification_back_file
    }
    if (type == 'selfie') {
      this.viewImage = 'data:image/png;base64,' + this.data.customer.people.identification_selfie_file
    }
    if (type == 'signature') {
      this.viewImage = 'data:image/png;base64,' + this.data.customer.people.identification_signature_file
    }
    if (type == 'cccd_front_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64FrontCompare
    }
    if (type == 'cccd_back_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64BackCompare
    }
    if (type == 'selfie_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64SelfieCompare
    }
    if (type == 'signature_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data.people.base64SignatureCompare
    }
    if (type == 'sim') {
      this.viewImage = 'data:image/png;base64,' + this.data?.msisdn?.base64SimFile[mobile]
    }
    if (type == 'sim_compare') {
      this.viewImage = 'data:image/png;base64,' + this.data?.msisdn?.base64SimFile[mobile]
    }

    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
    });
  }

  onCloseModalImage() {
    this.viewImage = null;
    this.modalRef.close();
  }

  downloadImage(base64Data, fileName) {
    const downloadLink = document.createElement('a');
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
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

  ngOnInit(): void {
    this.listCurrentAction = this.currentUser.actions;
    if (this.item) {
      if (this.item.action == this.listTaskAction.change_info.value) {
        this.actionText = 'Cập nhật';
        this.titleDocumentImage = 'Ảnh phiếu thay đổi thông tin';
        this.titleModal = 'Đổi sim'
      } else {
        this.titleModal = 'Đấu nối sim mới';
      }
      this.getData(1);
    }
  }

  getData(action_view = null) {
    if(this.typeDetail && this.typeDetail == 'msisdn') {
      this.telecomService.getDetailTaskMsisdn(this.item.id).subscribe(res => {
        this.data = res.data;
        for (const msi of this.data.msisdn.msisdns) {
          this.mnos.push(msi.mno);
        }
        if (this.data.task.action == this.listTaskAction.change_info) {
          this.actionText = 'Cập nhật'
        }
      })
    } else {
      this.telecomService.getDetailTask(this.item.id, action_view).subscribe(res => {
        this.data = res.data;
        for (const msi of this.data.msisdn.msisdns) {
          this.mnos.push(msi.mno);
        }
        if (this.data.task.action == this.listTaskAction.change_info) {
          this.actionText = 'Cập nhật'
        }
        const detailObj = JSON.parse(this.data.task.detail);
      })
    }
    
  }

  async modalOpen(modal, item = null) { 
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg',
      backdrop : 'static',
      keyboard : false
    });
  }

  async modalClose() {
    // this.getData();
    this.modalRef.close(); 
  }

  onUploadImages() {
    this.modalClose();
    this.getData();
    // this.createNewTask.emit({});
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

}
