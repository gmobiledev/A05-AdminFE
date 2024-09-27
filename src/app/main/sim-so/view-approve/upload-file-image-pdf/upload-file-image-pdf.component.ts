import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-upload-file-image-pdf',
  templateUrl: './upload-file-image-pdf.component.html',
  styleUrls: ['./upload-file-image-pdf.component.scss']
})
export class UploadFileImagePdfComponent implements OnInit {
  @Input() task_id: any;
  file = [];
  urls: any[] = [];
  multiples: any[] = [];
  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private cf: ChangeDetectorRef,
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
  ) { }

  ngOnInit(): void {

  }

  onSelectFile(event) {
    if (this.multiples.length == 10) {
      this.alertService.showMess('Tải lên tối đa 10 file!');
      return;
    } else {
      if (event?.target?.files?.length == 0) {
        return;
      } else {
        this.file.push(event?.target?.files[0]);
        console.log('file', this.file);
        let i: number = 0;
        for (const singlefile of event.target.files) {
          var reader = new FileReader();
          reader.readAsDataURL(singlefile);
          this.cf.detectChanges();
          i++;
          reader.onload = (event) => {
            const url = (<FileReader>event.target).result as string;
            let type = '';
            if (url.includes('jpg') || url.includes('png') || url.includes('jpeg')) {
              type = 'img';
            } else if (url.includes('pdf')) {
              type = 'pdf';
            }
            this.multiples.push({
              url: url,
              type: type
            });
            console.log(this.multiples);
            this.cf.detectChanges();
          };
        }
      }
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('task_id', this.task_id);
    this.file.forEach((file) => { formData.append('files', file); })

    this.telecomService.postUpdateAttachments(formData).subscribe((res: any) => {
      if (res.status === 1) {
        this.alertService.showMess(res.message);
      } else {
        this.alertService.showMess(res.message);
      };
      this.itemBlockUI.stop();
    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }
}
