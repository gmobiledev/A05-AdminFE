import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { MsisdnStatus, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import JSZip from 'jszip';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-g-task-item',
  templateUrl: './g-task-item.component.html',
  styleUrls: ['./g-task-item.component.scss']
})
export class GTaskItemComponent implements OnInit {

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
    private gtalkService: GtalkService,
    private adminService: AdminService,
    private alertService: SweetAlertService
  ) {

  }

  async onUpdateStatus(task_id, status) {
    let confirmMessage;
    if(status == 1) {
      confirmMessage = "Bạn có đồng ý duyệt?"
    } else if (status == 0) {
      confirmMessage = "Bạn không duyệt yêu cầu này?"
    }
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gtalkService.approve2GTaskStatus({
        task_id: task_id,
        status: status
      }).subscribe( res => {
        if(!res.status) {
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
    this.gtalkService.getDetailTask(this.item.id).subscribe(res => {
      this.detailTask = res.data;
    })
  }
}