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

  public modalRef: any;

  constructor(
    private modalService: NgbModal,
    private gtalkService: GtalkService,
    private adminService: AdminService,
    private alertService: SweetAlertService
  ) {

  }
  

  ngOnInit(): void {
      // this.getData();
  }

  getData() {
    this.gtalkService.getDetailTask(this.item.id).subscribe(res => {
      this.item = res.data;
    })
  }
}