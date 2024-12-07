import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";

@Component({
  selector: "app-transfer-sovereignty-new-owner",
  templateUrl: "./transfer-sovereignty-new-owner.component.html",
  styleUrls: ["./transfer-sovereignty-new-owner.component.scss"],
})
export class TransferSovereigntyNewOwnerComponent implements OnInit {
  @Output() dataSplit = new EventEmitter();
  @Input() select;
  @Input() data;
  formOgzOcr;
  imageFront;
  imageBack;
  imageSelfie;
  imageFrontAuthorizer;
  imageBackAuthorizer;
  imageSelfieAuthorizer;
  imageFrontUser;
  imageBackUser;
  imageSelfieUser;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: SweetAlertService,
    private telecomService: TelecomService
  ) {}

  ngOnInit(): void {
    console.log(this.select);
    console.log("data", this.data);
    this.initForm();
  }

  async onSelectFileBack(event, name) {
    if (event.target.files && event.target.files[0]) {
      if (name == "identification_back_file") {
        this.imageBack = await this.resizeImage(event.target.files[0]);
      } else if (name == "card_back_authorizer") {
        this.imageBackAuthorizer = await this.resizeImage(
          event.target.files[0]
        );
      } else if (name == "card_back_user") {
        this.imageBackUser = await this.resizeImage(event.target.files[0]);
      }
      const regex = /^.*base64,/i;
      if (name == "identification_back_file") {
        this.formOgzOcr.controls["identification_back_file"].setValue(
          this.imageBack.replace(regex, "")
        );
      } else if (name == "card_back_authorizer") {
        this.formOgzOcr.controls["card_back_authorizer"].setValue(
          this.imageBackAuthorizer.replace(regex, "")
        );
      } else if (name == "card_back_user") {
        this.formOgzOcr.controls["card_back_user"].setValue(
          this.imageBackUser.replace(regex, "")
        );
      }
    }
  }

  async onSelectFileFront(event, name) {
    if (event.target.files && event.target.files[0]) {
      if (name == "identification_front_file") {
        this.imageFront = await this.resizeImage(event.target.files[0]);
      } else if (name == "card_front_authorizer") {
        this.imageFrontAuthorizer = await this.resizeImage(
          event.target.files[0]
        );
      } else if (name == "card_front_user") {
        this.imageFrontUser = await this.resizeImage(event.target.files[0]);
      }
      this.imageFront = await this.resizeImage(event.target.files[0]);
      const regex = /^.*base64,/i;
      if (name == "identification_front_file") {
        this.formOgzOcr.controls["identification_front_file"].setValue(
          this.imageBack.replace(regex, "")
        );
      } else if (name == "card_front_authorizer") {
        this.formOgzOcr.controls["card_front_authorizer"].setValue(
          this.imageFrontAuthorizer.replace(regex, "")
        );
      } else if (name == "card_front_user") {
        this.formOgzOcr.controls["card_front_user"].setValue(
          this.imageFrontUser.replace(regex, "")
        );
      }
    }
  }

  async onSelectFileSelfie(event, name) {
    if (event.target.files && event.target.files[0]) {
      if (name == "identification_selfie_file") {
        this.imageSelfie = await this.resizeImage(event.target.files[0]);
      } else if (name == "selfie_authorizer") {
        this.imageSelfieAuthorizer = await this.resizeImage(
          event.target.files[0]
        );
      } else if (name == "selfie_user") {
        this.imageSelfieUser = await this.resizeImage(event.target.files[0]);
      }
      this.imageSelfie = await this.resizeImage(event.target.files[0]);
      const regex = /^.*base64,/i;
      if (name == "identification_selfie_file") {
        this.formOgzOcr.controls["identification_selfie_file"].setValue(
          this.imageSelfie.replace(regex, "")
        );
      } else if (name == "selfie_authorizer") {
        this.formOgzOcr.controls["selfie_authorizer"].setValue(
          this.imageSelfieAuthorizer.replace(regex, "")
        );
      } else if (name == "selfie_user") {
        this.formOgzOcr.controls["selfie_user"].setValue(
          this.imageSelfieUser.replace(regex, "")
        );
      }
    }
  }

  updateInformation() {
    let data;
    if (this.select.id == 0) {
      if (!this.formOgzOcr.value.identification_back_file) {
        this.alertService.showMess("Vui lòng không để trống ảnh CMND/CCCD mặt sau");
        return;
      }
      if (!this.formOgzOcr.value.identification_front_file) {
        this.alertService.showMess("Vui lòng không để trống ảnh CMND/CCCD mặt trước");
        return;
      }
      if (!this.formOgzOcr.value.identification_selfie_file) {
        this.alertService.showMess("Vui lòng không để trống ảnh chân dung");
        return;
      }
      data = {
        task_id: this.data.task_id,
        personal: {
          card_front:this.formOgzOcr.value.identification_front_file,
          card_back:this.formOgzOcr.value.identification_back_file,
          selfie:this.formOgzOcr.value.identification_selfie_file
        },
        ownerType: 1
      }
    } else {
      if (!this.formOgzOcr.value.businessName) {
        this.alertService.showMess("Vui lòng không để trống tên doanh nghiệp");
        return;
      }
      if (!this.formOgzOcr.value.businessCode) {
        this.alertService.showMess("Vui lòng không để trống mã công ty");
        return;
      }
      if (!this.formOgzOcr.value.businessAddress) {
        this.alertService.showMess("Vui lòng không để trống địa chỉ");
        return;
      }
      if (!this.formOgzOcr.value.representativeName) {
        this.alertService.showMess("Vui lòng không để trống tên người đại diện");
        return;
      }
      if (!this.formOgzOcr.value.card_front_authorizer) {
        this.alertService.showMess("Vui lòng không để trống ảnh CMND/CCCD mặt trước người đại diện");
        return;
      }
      if (!this.formOgzOcr.value.card_back_authorizer) {
        this.alertService.showMess("Vui lòng không để trống ảnh CMND/CCCD mặt sau người đại diện");
        return;
      }
      if (!this.formOgzOcr.value.selfie_authorizer) {
        this.alertService.showMess("Vui lòng không để trống ảnh chân dung người đại diện");
        return;
      }
      if (!this.formOgzOcr.value.card_front_user) {
        this.alertService.showMess("Vui lòng không để trống ảnh CMND/CCCD mặt trước người sử dụng");
        return;
      }
      if (!this.formOgzOcr.value.card_back_user) {
        this.alertService.showMess("Vui lòng không để trống ảnh CMND/CCCD mặt sau người sử dụng");
        return;
      }
      if (!this.formOgzOcr.value.selfie_user) {
        this.alertService.showMess("Vui lòng không để trống ảnh chân dung người sử dụng");
        return;
      }
      if (!this.formOgzOcr.value.userFullName) {
        this.alertService.showMess("Vui lòng không để trống tên người sửa dụng");
        return;
      }
      data = {
        task_id: this.data.task_id,
        business: {
          businessName:this.formOgzOcr.value.businessName,
          businessCode:this.formOgzOcr.value.businessCode,
          businessAddress:this.formOgzOcr.value.businessAddress,
          representativeName:this.formOgzOcr.value.representativeName,
          card_front_authorizer:this.formOgzOcr.value.card_front_authorizer,
          card_back_authorizer:this.formOgzOcr.value.card_back_authorizer,   
          selfie_authorizer:this.formOgzOcr.value.selfie_authorizer,
          card_front_user:this.formOgzOcr.value.card_front_user,
          card_back_user:this.formOgzOcr.value.card_back_user,
          selfie_user:this.formOgzOcr.value.selfie_user,
          userFullName:this.formOgzOcr.value.userFullName
        },
        ownerType: 2
      }
    }
    this.telecomService.postFileUploadOcr(data).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.dataSplit.emit({
            image: data,
            data: res.data,
          });
        } else {
          this.alertService.showMess(res.message);
        }
      },
      (err) => {
        this.alertService.showError(err);
      }
    );
  }

  initForm() {
    this.formOgzOcr = this.formBuilder.group({
      identification_back_file: ["", Validators.required],
      identification_front_file: ["", Validators.required],
      identification_selfie_file: ["", Validators.required],

      businessName: ["", Validators.required],
      businessCode: ["", Validators.required],
      businessAddress: ["", Validators.required],
      representativeName: ["", Validators.required],
      card_front_authorizer: ["", Validators.required],
      card_back_authorizer: ["", Validators.required],
      selfie_authorizer: ["", Validators.required],
      card_front_user: ["", Validators.required],
      card_back_user: ["", Validators.required],
      selfie_user: ["", Validators.required],
      userFullName: ["", Validators.required],
    });
  }

  onReUpload(img) {
    switch (img) {
      case "imageFront":
        this.imageFront = null;
        break;
      case "imageBack":
        this.imageBack = null;
        break;
      case "imageSelfie":
        this.imageSelfie = null;
        break;
      case "imageSelfieAuthorizer":
        this.imageSelfieAuthorizer = null;
        break;
      case "imageSelfieUser":
        this.imageSelfieUser = null;
        break;
      case "imageFrontAuthorizer":
        this.imageFrontAuthorizer = null;
        break;
      case "imageFrontUser":
        this.imageFrontUser = null;
        break;
      case "imageBackUser":
        this.imageBackUser = null;
        break;
      case "imageBackAuthorizer":
        this.imageBackAuthorizer = null;
        break;
      default:
        break;
    }
  }

  resizeImage(image) {
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = () => {
        let img = new Image();
        img.onload = () => {
          let width = img.width < 900 ? img.width : 900;
          let height =
            img.width < 900 ? img.height : (width * img.height) / img.width;
          let canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext("2d");
          if (ctx != null) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          let data = canvas.toDataURL("image/png");
          resolve(data);
        };

        // @ts-ignore
        img.src = fr.result;
      };

      fr.readAsDataURL(image);
    });
  }
}
