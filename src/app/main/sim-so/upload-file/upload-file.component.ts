import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'sim-so-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})

export class UploadFileComponent implements OnInit {

  @Input() item: any;
  @Input() currentUserId: any;
  @Output() updateStatus = new EventEmitter<{ updated: boolean }>();
  @Output() uploadImages = new EventEmitter<{ updated: boolean }>();

  public fileAttachment;
  public imageToTrinhBase64;
  public imageBack;
  public imageBackBase64;
  public imageSelfie;
  public imageSelfieBase64;
  public detailTask;
  isUploadNew = 0;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  async onSelectFile(event, file_type) {
    console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      this.fileAttachment = event.target.files[0];
      if (event.target.files[0].type == "application/pdf") {

      } else if (file_type == 'to-trinh') {
        this.isUploadNew = 1;
        this.imageToTrinhBase64 = await this.resizeImage(event.target.files[0]);
        this.fileAttachment = this.dataURLtoFile(this.imageToTrinhBase64, `to-trinh.png`);
      }
    }

  }

  async onSubmitUpload() {
    let self = this;
    let data = new FormData();
    data.append("file", this.fileAttachment, this.fileAttachment.filename);

    if ((await this.alertService.showConfirm("Bạn có muốn tải file này lên?")).value) {
      this.sectionBlockUI.start();
      this.telecomService.attachmentMsisdn(self.item.msisdn.id, data).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.uploadImages.emit({ updated: true });
        this.alertService.showSuccess(res.message);
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
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

  getData() {
    this.telecomService.getDetailTaskV2(this.item.id).subscribe(res => {
      this.detailTask = res.data;
    })
  }
}

