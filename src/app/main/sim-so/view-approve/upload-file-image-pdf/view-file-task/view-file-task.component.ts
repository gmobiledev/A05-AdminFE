import { Component, Input, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-view-file-task',
  templateUrl: './view-file-task.component.html',
  styleUrls: ['./view-file-task.component.scss']
})
export class ViewFileTaskComponent implements OnInit {
  @Input() item: any;
  @Input() task_id: any;
  url;
  type = '';
  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
  ) { }

  ngOnInit(): void {
    this.viewFileTask();
  }

  viewFileTask() {
    const data = {
      url: this.item.path
    }
    this.itemBlockUI.start();
    this.telecomService.postViewFileTask(this.task_id, data).subscribe((res: any) => {

      if (res.status === 1) {
        if (res.data[0].name.includes('jpg') || res.data[0].name.includes('png') || res.data[0].name.includes('jpeg')) {
          this.type = 'img';
        } else if (res.data[0].name.includes('pdf')) {
          this.type = 'pdf';
        } else if (res.data[0].name.includes('mp4')) {
          this.type = 'video';
        }
        this.url = res.data[0].value;
      }
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }
}
