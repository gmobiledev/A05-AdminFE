import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-approve-convert2g-identification',
  templateUrl: './approve-convert2g-identification.component.html',
  styleUrls: ['./approve-convert2g-identification.component.scss']
})
export class ApproveConvert2gIdentificationComponent implements OnInit {

  @Input() item: any;
  @Input() currentUserId: any;
  @Output() updateStatus = new EventEmitter<{ updated: boolean }>();
  
  public imageFront;
  public imageFrontBase64;
  public imageBack;
  public imageBackBase64;
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
    if(event.target.files && event.target.files[0]) {
      if(file_type == 'front') {         
        this.isUploadNew = 1;
        this.imageFrontBase64 = await this.resizeImage(event.target.files[0]);
        this.imageFront = this.dataURLtoFile(this.imageFrontBase64, `old_front.png`);
      }
      if(file_type == 'back') {        
        this.isUploadNew = 1;
        this.imageBackBase64 = await this.resizeImage(event.target.files[0]);
        this.imageBack  = this.dataURLtoFile(this.imageBackBase64, `old_back.png`);
      }
      
    } 
    
  }

  async onSubmitUpload() {
    let data = new FormData();
    data.append("task_id", this.item.id);    
    data.append("identification_no", this.detailTask.old_people.identification_no);
    data.append("is_upload_new", this.isUploadNew + '');
    data.append("mat_truoc", this.imageFront);
    data.append("mat_sau", this.imageBack);

    if ((await this.alertService.showConfirm("Bạn có muốn tải các hình ảnh này lên")).value) {
      this.sectionBlockUI.start();
      this.telecomService.uploadOldIdenficationDocs(data).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
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
      if(this.detailTask.old_people.base64Front) {
        this.imageFrontBase64 = 'data:image/png;base64,' + this.detailTask.old_people.base64Front;
        this.imageFront = this.dataURLtoFile(this.imageFrontBase64, `old_front.png`);
      }
      if(this.detailTask.old_people.base64Back) {
        this.imageBackBase64 = 'data:image/png;base64,' + this.detailTask.old_people.base64Back;
        this.imageBack  = this.dataURLtoFile(this.imageBackBase64, `old_back.png`);
      }
    })
  }
}
