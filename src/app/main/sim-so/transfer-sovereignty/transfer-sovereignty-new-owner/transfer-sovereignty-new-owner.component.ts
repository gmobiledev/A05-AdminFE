import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-transfer-sovereignty-new-owner",
  templateUrl: "./transfer-sovereignty-new-owner.component.html",
  styleUrls: ["./transfer-sovereignty-new-owner.component.scss"],
})
export class TransferSovereigntyNewOwnerComponent implements OnInit {
  @Output() showModal = new EventEmitter();
  @Input() select;
  formOgzOcr;
  formOgzOcrBusiness;
  imageFront;
  imageBack;
  imageSelfie;
  selectIndividual = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.select);
    
    if (this.select == "individual") {
      this.selectIndividual = true;
    this.initForm();
    } else {
      this.selectIndividual = false;
    this.initFormBusiness();
    }
  }

  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageBack = await this.resizeImage(event.target.files[0]);
      const regex = /^.*base64,/i;
      this.formOgzOcr.controls["identification_back_file"].setValue(
        this.imageBack.replace(regex, "")
      );
    }
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0]);
      const regex = /^.*base64,/i;
      this.formOgzOcr.controls["identification_front_file"].setValue(
        this.imageFront.replace(regex, "")
      );
    }
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageSelfie = await this.resizeImage(event.target.files[0]);
      const regex = /^.*base64,/i;
      this.formOgzOcr.controls["identification_selfie_file"].setValue(
        this.imageSelfie.replace(regex, "")
      );
    }
  }

  updateInformation() {
    this.showModal.emit(true);
  }

  onReUpload(img) {
    switch (img) {
      case "front":
        this.imageFront = null;
        break;
      case "back":
        this.imageBack = null;
        break;
      case "selfie":
        this.imageSelfie = null;
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

  initForm() {
    this.formOgzOcr = this.formBuilder.group({
      identification_back_file: ["", Validators.required],
      identification_front_file: ["", Validators.required],
      identification_selfie_file: ["", Validators.required],
    });
  }

  initFormBusiness() {
    this.formOgzOcrBusiness = this.formBuilder.group({
      identification_back_file: ["", Validators.required],
      identification_front_file: ["", Validators.required],
      identification_selfie_file: ["", Validators.required],
    });
  }
}
