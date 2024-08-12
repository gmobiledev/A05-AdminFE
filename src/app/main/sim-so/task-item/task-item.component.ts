import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { MsisdnStatus, TaskAction, TaskTelecom, TaskTelecomStatus, TelecomTaskSubAction } from 'app/utils/constants';
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
  @Output() uploadImages = new EventEmitter<{ updated: boolean }>();

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
  public imageSgnatureBase64;

  public dataCreateSignature = {
    people: {
      identification_signature_file: ''
    }
  }

  dataResendMail = {
    task_id: 0,
    email: '',
    reason: ''
  }


  simFile: any;
  disabled_kit: boolean = false;
  kit_serial: string;
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

  async onUpdateStatusV2(item, status) {
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
          this.telecomService.updateTaskStatusV2(item.action, item.id, { status: status, note: note }).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              // this.alertService.showError(res.message);
              return;
            }
            this.getData();
          }, error => {

          });

          const listPhone = this.data.msisdn;
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
      if (status == this.taskTelecomStatus.STATUS_SUCCESS) {
        confirmMessage = "Xác nhận đã thành công?"
      }

      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.telecomService.updateTaskStatusV2(item.action, item.id, { status: status }).subscribe(res => {
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
          const listPhone = this.data.msisdn;
          const dataPushNotify = {
            user_ids: [this.data.task.request_by],
            title: `Yêu cầu ${this.actionText} ID ${this.data.task.id} đã thành công`,
            message: `${this.actionText} số ${listPhone}`,
            data: {
              "type": this.data.task.action,
              "status": status + "",
              "message": `Yêu cầu ${this.actionText} ID ${this.data.task.id} số ${listPhone} thành công.`,
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
        this.alertService.showSuccess(res.data.message, 15000);
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showError(error, 15000);
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
          this.telecomService.conversion2GApprove({ task_id: item.id, status: status, note: note }).subscribe(res => {
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
        this.telecomService.conversion2GApprove({ task_id: item.id, status: status }).subscribe(res => {
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
    this.telecomService.getDetailSim({ keysearch: this.data.task.msisdn, category_id: 2, take: 10 }).subscribe(res => {
      if (res.data && res.data.short_desc && res.data.short_desc.includes('8984')) {
        this.disabled_kit = true;
        this.kit_serial = res.data.short_desc;
      }
      this.modalRef = this.modalService.open(this.modalUploadSim, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });
    })

  }

  onCloseModal() {
    this.disabled_kit = false;
    this.kit_serial = '';
    this.modalRef.close();
  }

  async onSelectFile(event, file_type) {
    if (event.target.files && event.target.files[0]) {
      this.simFile = event.target.files[0]
    }
  }

  async onSelectFileSignature(event, file_type) {
    if (event.target.files && event.target.files[0]) {
      this.imageSgnatureBase64 = await this.resizeImage(event.target.files[0]);
      this.dataCreateSignature.people.identification_signature_file = this.imageSgnatureBase64.replace('data:image/png;base64,', '')
    }

  }

  private dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  resizeImage(image) {
    return new Promise((resolve) => {
      let fr = new FileReader;
      fr.onload = () => {
        var img = new Image();
        img.onload = () => {
          console.log(img.width);
          let width = img.width < 900 ? img.width : 900;
          let height = img.width < 900 ? img.height : width * img.height / img.width;
          console.log(width, height);
          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d');
          if (ctx != null) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          let data = canvas.toDataURL('image/png');
          resolve(data);
        };

        // @ts-ignore
        img.src = fr.result;
      };

      fr.readAsDataURL(image);
    })
  }

  async onSubmitUpload() {
    if ((await this.alertService.showConfirm("Bạn có muốn tải hình ảnh này lên?")).value) {
      this.sectionBlockUI.start();
      this.telecomService.patchSignature(this.item.id, this.dataCreateSignature).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.uploadImages.emit({ updated: true });
        this.alertService.showSuccess(res.message);
        this.modalRef.close();
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onCreateTask() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo phiếu yêu cầu/hợp đồng ?")).value) {
      this.telecomService.getCreatContract(this.item.id).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.alertService.showMess(error);
        return;
      })
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
    if (!serial || serial == undefined) {
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
        if (!res.status) {
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
      backdrop: 'static',
      keyboard: false
    });
  }

  /**
   * Lưu link tracking
   * 
   * @param link 
   * @returns 
   */
  async onSubmitShipTracking(link) {
    if (!link || link == undefined) {
      this.alertService.showMess("Vui lòng nhập link");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý lưu lại")).value) {
      this.telecomService.submitShipTracking({
        ship_tracking: link,
        task_id: this.item.id
      }).subscribe(res => {
        if (!res.status) {
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

  async onResendMail() {
    if(!this.dataResendMail.reason) {
      this.alertService.showMess("Vui lòng nhập lý do");
      return;
    }
    if ((await this.alertService.showConfirm(`Bạn có đồng ý gửi lại vào email ${this.dataResendMail.email}`)).value) {
      this.telecomService.resendMail(this.dataResendMail).subscribe(res => {        
        if(res && !res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        if(res){
          this.alertService.showSuccess(res.message);
        }
        
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onRetryTask() {
    if ((await this.alertService.showConfirm(`Bạn có đồng ý thực hiện lại?`)).value) {
      const data = {
        task_id: this.data.task.id
      }
      this.telecomService.retryTask(data).subscribe(res => {        
        if(res && !res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        if(res){
          this.alertService.showSuccess(res.message);
        }
        
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
        return;
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
            data: this.data?.task?.document_image
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
        if (this.currentGPKD) {
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
    } else if (this.data.task.action == this.listTaskAction.change_sim.value) {

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
      if (this.item.action == this.listTaskAction.change_sim.value) {
        this.actionText = 'Cập nhật';
        this.titleDocumentImage = 'Ảnh phiếu thay đổi thông tin';
        this.titleModal = 'Đổi sim'
      } else if (this.item.action == this.listTaskAction.change_info.value) {
        this.actionText = 'Cập nhật TTTB';
        this.titleDocumentImage = 'Ảnh phiếu thay đổi thông tin';
        this.titleModal = 'Cập nhật TTTB'
      } else {
        this.titleModal = 'Đấu nối sim mới';
      }
      this.getData(1);
    }
  }

  getData(action_view = null) {
    if (this.typeDetail && this.typeDetail == 'msisdn') {
      this.telecomService.getDetailTaskMsisdn(this.item.id).subscribe(res => {
        this.data = res.data;
        for (const msi of this.data.msisdn.msisdns) {
          this.mnos.push(msi.mno);
        }
        if (this.data.task.action == this.listTaskAction.change_sim) {
          this.actionText = 'Cập nhật'
        }
      })
    } else {
      this.telecomService.getDetailTask(this.item.id, action_view).subscribe(res => {
        this.data = res.data;
        for (const msi of this.data.msisdn.msisdns) {
          this.mnos.push(msi.mno);
        }
        if (this.data.task.action == this.listTaskAction.change_sim) {
          this.actionText = 'Cập nhật';          
        }
        const detailObj = JSON.parse(this.data.task.detail);
        if(this.data.task.sub_action == TelecomTaskSubAction.SIM_TO_ESIM) {
          this.dataResendMail.email = detailObj['email'];
          this.dataResendMail.task_id = this.data.task.id;
        }
      })
    }

  }

  async modalOpen(modal, item = null, size = 'lg') {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: size,
      backdrop: 'static',
      keyboard: false
    });
  }

  async modalClose() {
    this.modalRef.close();
  }

  isValidAsyncBy(task) {
    if (this.data.task.sub_action == this.listTaskAction['_4G_VNM_TO_VMS']["value"] && task.status != TaskTelecomStatus.STATUS_SUCCESS)
      return true;
    return this.currentUserId == task.sync_by && task.status != TaskTelecomStatus.STATUS_SUCCESS && this.typeDetail != 'msisdn'
  }

  isShowButtonApprove() {
    if (this.checkAction('telecom-admin/task/approve-2g-conversion') &&
      this.data.task.sub_action == this.listTaskAction['TYPE_2G_CONVERSION']['value'] ||
      this.data.task.sub_action == this.listTaskAction['GSIM_TO_SIM']['value'] ||
      this.data.task.sub_action == this.listTaskAction['_4G_VNM_TO_VMS']["value"]
    ) {
      return true;
    }
    return false;
  }

  onUploadImages() {
    this.modalClose();
    this.getData();
    // this.createNewTask.emit({});
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

  allowChangeCmndToCccd(task) {
    return [TaskTelecomStatus.STATUS_PROCESSING, TaskTelecomStatus.STATUS_APPROVED, TaskTelecomStatus.STATUS_WAITING_SIM].includes(task.status)
      && ['GSIM_TO_SIM', '2G_CONVERSION', '4G_VNM_TO_VMS'].includes(task.sub_action) && this.checkAction('telecom-admin/task/2g-convert-cmnd-to-cccd')
  }

  onChangeCmndToCccd() {
    let self = this
    console.log("MyItem", this.item);
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1'],
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    })
      .queue([
        {
          title: 'Số CCCD mới của khách hàng',
          text: 'Nhập chính xác'
        },
      ])
      .then(function (result) {
        let body = {
          "task_id": self.item.id,
          "id_no": result["value"][0]
        }
        self.telecomService.convertCmndToCCCD(body).subscribe(res => {
          console.log("res", res);
          Swal.fire({
            title: res.code,
            html: res.message + " - Thoát ra và xem chi tiết",
            customClass: { confirmButton: 'btn btn-primary' },
            icon: "success"
          });
        }, err => {
          console.log("err", err);
          Swal.fire({
            title: err,
            html: err,
            customClass: { confirmButton: 'btn btn-primary' },
            icon: "error"
          });
        })

      });
  }

  checkMsisdnTaskGsim(data) {
    return data.task.action == this.listTaskAction.CANCEL_SUBCRIBER.value &&
      data.msisdn.msisdns[0] && data.msisdn.msisdns[0].mno == 'GSIM' ? true : false;
  }

}
