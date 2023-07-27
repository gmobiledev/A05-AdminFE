import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { TaskTelecomStatus, TaskTelecom, MsisdnStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approve-convert2g-item',
  templateUrl: './approve-convert2g-item.component.html',
  styleUrls: ['./approve-convert2g-item.component.scss']
})
export class ApproveConvert2gItemComponent implements OnInit {

  @Input() item: any;
  @Input() currentUserId: any;
  @Output() updateStatus = new EventEmitter<{ updated: boolean }>();

  public taskTelecomStatus = TaskTelecomStatus;
  public listTaskAction = TaskTelecom.ACTION;
  public msisdnStatus = MsisdnStatus;
  public actionText = 'Chi tiết';
  public titleModal = 'Chi tiết';

  public detailTask;
  public viewImage;

  public modalRef: any;

  constructor(
    private modalService: NgbModal,
    private telecomService: TelecomService,
    private adminService: AdminService,
    private alertService: SweetAlertService
  ) {

  }

  async onUpdateStatus(task_id, status, type) {
    let confirmMessage;
    if (status == 1) {
      confirmMessage = "Bạn có đồng ý duyệt?"
    } else if (status == 0) {
      confirmMessage = "Bạn không duyệt yêu cầu này?"
    }
    let dataSubmit = {
      task_id: task_id,
      status: status,
      note: ''
    }
    if(status == 0) {
      Swal.fire({
        title: 'Không duyệt với lý do',
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
          dataSubmit.note = note;
          if (type == 'duyet_tttb') {
            this.telecomService.approveSubcriberInfo(dataSubmit).subscribe( res => {
              if (!res.status) {
                Swal.showValidationMessage(
                  res.message
                )
                this.alertService.showError(res.message);
                return;
              }
              this.getData();
              this.alertService.showSuccess('Thành công');
            }, error => {
              this.alertService.showError(error);
            });
          } else if (type == 'duyet_hang_so') {
            this.telecomService.approveMsisdnLevel(dataSubmit).subscribe( res => {
              if (!res.status) {
                Swal.showValidationMessage(
                  res.message
                )
                this.alertService.showError(res.message);
                return;
              }
              this.getData();
              this.alertService.showSuccess('Thành công');
            }, error => {
              this.alertService.showError(error);
            });
          }
          // const dataPushNotify = {
          //   user_ids: [this.data.task.request_by],
          //   message: `${this.actionText} thất bại: ${note}`,
          //   title: `${this.actionText} số ${item.msisdn}`,
          //   data: {
          //     "type": this.data.task.action,
          //     "status": status + "",
          //     "message": `${this.actionText} số ${item.msisdn} thất bại: ${note} lý do: ${note}`,
          //     "id": this.data.task.id + ""
          //   }
          // }
          // this.adminService.pushNotify(dataPushNotify).subscribe(res => {

          // });
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {

        }
      })
    } else
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      if (type == 'duyet_tttb') {
        this.telecomService.approveSubcriberInfo({
          task_id: task_id,
          status: status
        }).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
      if (type == 'duyet_hang_so') {
        this.telecomService.approveMsisdnLevel({
          task_id: task_id,
          status: status
        }).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
    }
  }
  
  onViewImage(modal, type, mobile = null) {
    if (type == 'cccd_front') {
      this.viewImage = 'data:image/png;base64,' + this.detailTask.people.base64Front
    }
    if (type == 'cccd_back') {
      this.viewImage = 'data:image/png;base64,' + this.detailTask.people.base64Back
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

  ngOnInit(): void {
      this.getData();
  }

  getData() {
    this.telecomService.getDetailTaskV2(this.item.id).subscribe(res => {
      this.detailTask = res.data;
    })
  }

}
