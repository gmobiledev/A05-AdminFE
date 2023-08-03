import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonService } from 'app/utils/common.service';
import { TaskTelecomStatus, TaskTelecom, MsisdnStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-task-organization',
  templateUrl: './view-task-organization.component.html',
  styleUrls: ['./view-task-organization.component.scss']
})
export class ViewTaskOrganizationComponent implements OnInit {

  id;
  selectedItem: any;
  data: any;
  urlFileDKKD: any;
  fileContract: any;
  selectedAgent: any;
  public modalRef: any;
  public taskTelecomStatus = TaskTelecomStatus;
  public listTaskAction = TaskTelecom.ACTION;
  public msisdnStatus = MsisdnStatus;
  public actionText = 'Đấu nối';

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader: any =  {
    headerTitle: 'Yêu cầu của đại lý',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Home',
          isLink: true,
          link: '/'
        },
        {
          name: 'Yêu cầu của đại lý',
          isLink: false
        }
      ]
    }
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private readonly telecomService: TelecomService,
    private readonly alertService: SweetAlertService,
    private readonly commonService: CommonService,
    private adminService: AdminService,
  ) { 
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getData();
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

  modalClose() {    
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();    
  }

  async modalViewAgentOpen(modal, item = null) { 
    if(item) {
      // this.itemBlockUI.start();
      
        try {
          let res = await this.telecomService.taskViewAgent(item);
          if(!res.status) { 
            this.getData();
            this.alertService.showMess(res.message);
          }
          this.selectedAgent = res.data;
          // this.itemBlockUI.stop();
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'sm',
            backdrop : 'static',
            keyboard : false
          });
        } catch (error) {
          // this.itemBlockUI.stop();
          return;
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

  async onSelectFile(event) {
    if(event.target.files && event.target.files[0]) {
      this.fileContract = event.target.files[0];
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


  async onSubmitUpload() {
    let data = new FormData();
    data.append("task_id", this.id);    
    data.append("identification_no", '0123987');
    data.append("hopdong", this.fileContract);

    if ((await this.alertService.showConfirm("Bạn có muốn tải hợp đồng lên")).value) {
      this.itemBlockUI.start();
      this.telecomService.uploadOganizationContract(data).subscribe(res => {
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
      }, error => {
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onTakeTask(task) {
    let check;
    try {
      check = await this.telecomService.checkAvailabledTask(task.id);
      if(!check.status) { 
        this.getData();        
        return;              
      }
      this.sectionBlockUI.stop();
    } catch (error) {
      this.sectionBlockUI.stop();
      return;
    }
  }

  getData() {
    this.telecomService.getDetailTask(this.id).subscribe(res => {
      this.data = res.data;
      if(this.data.organization.base64LiceseFile) {
        this.urlFileDKKD = this.commonService.base64ToArrayBuffer(this.data.organization.base64LiceseFile)
      }      
    })
  }

}
