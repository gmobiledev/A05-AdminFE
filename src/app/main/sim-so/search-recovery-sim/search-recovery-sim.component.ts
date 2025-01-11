import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "app/auth/service";

@Component({
  selector: "app-search-recovery-sim",
  templateUrl: "./search-recovery-sim.component.html",
  styleUrls: ["./search-recovery-sim.component.scss"],
})
export class SearchRecoverySimComponent implements OnInit {
  searchSim = "";
  imageFront;
  imageBack;
  imageSelfie;
  formOgzOcr;
  taskId;
  showSubmit = false;
  msisdn;
  dataRestorerInformation;
  public modalRef: any;
  showInformation = false;
  public selectedFiles: File[] = [];
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @ViewChild("modalItem") modalItem: ElementRef;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files[0] && input.files[0].size > 0) {
      let file = input.files[0];
      this.selectedFiles.push(file);
      console.log(this.selectedFiles);
    }
  }

  async onSubmitUpload() {
    if (this.selectedFiles.length <= 0) {
      this.alertService.showMess("Vui lòng không để trống file");
      return;
    }
    if (this.selectedFiles.length > 0) {
      const body = {
        action: "KHOI_PHUC",
        note: "KHOI_PHUC_SIM",
        msisdn_id: this.msisdn,
        file: "",
      };
      this.itemBlockUI.start();
      this.telecomService.postCreateRecoverySim(body).subscribe(
        (res) => {
          if (res.status === 1) {
            this.taskId = res.data.id;
            const formData = new FormData();
            formData.append("entity", "people");
            formData.append("key", "attachments");
            formData.append("task_id", this.taskId);
            for (let i = 0; i < this.selectedFiles.length; i++) {
              const file = this.selectedFiles[i];
              formData.append(`files`, file);
            }
            console.log(formData);
            this.telecomService.postUpdateAttachments(formData).subscribe(
              (res) => {
                console.log(res);
                if (!res.status) {
                  this.itemBlockUI.stop();
                  this.alertService.showMess(res.message);
                  return;
                }
                this.showSubmit = true;
                this.itemBlockUI.stop();
              },
              (error) => {
                this.itemBlockUI.stop();
                this.alertService.showMess(error);
                return;
              }
            );
          } else {
            this.itemBlockUI.stop();
            this.showInformation = false;
          }
        },
        (err) => {
          this.itemBlockUI.stop();
          this.alertService.showMess(err);
        }
      );
    }
  }

  formatNumber(number: string): string {
    return number.replace(/[^\d]/g, "");
  }

  deleteFile(index) {
    console.log(index);
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
    }
  }

  onInputChange(name: string) {
    if (name == "searchSim") {
      this.searchSim = this.formatNumber(this.searchSim);
    } else {
      // if (this.formOgzOcr?.value?.new_serial) {
      //   this.formOgzOcr.value.new_serial = this.formatNumber(
      //     this.formOgzOcr.value.new_serial
      //   );
      // }
    }
  }

  done() {
    this.formOgzOcr.value.new_serial = "";
    this.selectedFiles = [];
    this.modalClose();
  }

  onSubmitSearch() {
    this.showInformation = false;
    // Trim the input value
    const trimmedSim = this.searchSim.trim();

    // Validate the input
    if (!trimmedSim) {
      this.alertService.showMess("Please enter a valid MSISDN.");
      return;
    }

    const body = {
      msisdn: trimmedSim,
    };

    this.taskId = null;
    this.itemBlockUI.start();
    this.telecomService.postSearchRecoverySim(body).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.imageFront = null;
          this.imageBack = null;
          this.imageSelfie = null;
          this.msisdn = res.data.msisdn.id;
          this.showInformation = true;
          this.itemBlockUI.stop();
        } else {
          this.itemBlockUI.stop();
          this.alertService.showMess(res.message);
        }
      },
      (err) => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      }
    );
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
      new_serial: ["", Validators.required],
      documentType: ["", Validators.required]
    });
  }

  modalClose() {
    this.searchSim = "";
    this.showInformation = false;
    this.dataRestorerInformation = null;
    this.modalRef.close();
  }

  modalClose2() {
    this.modalRef.close();
  }


  async modalOpen(modal, item = null) {
    // this.itemBlockUI.start();
    this.dataRestorerInformation = item;

    // this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "xl",
      backdrop: "static",
      keyboard: false,
    });
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

  updateInformation() {
    if (!this.formOgzOcr.value.documentType) {
      this.alertService.showMess("Vui lòng chọn loại thẻ căn cước");
      return;
    }
    const data = {
      task_id: this.taskId,
      card_front: this.formOgzOcr.value.identification_front_file,
      card_back: this.formOgzOcr.value.identification_back_file,
      selfie: this.formOgzOcr.value.identification_selfie_file,
      new_serial: this.formOgzOcr.value.new_serial,
      documentType: this.formOgzOcr.value.documentType == 5 ? 5 :''
    };
    this.itemBlockUI.start();

    this.telecomService.postUploadIdDoc(data).subscribe(
      (res) => {
        if (res.data && res.status === 1 && res.data != null && JSON.stringify(res.data) !== '{}') {
          const dataSim = {
            ...res.data,
            task_id: this.taskId,
            msisdn: this.searchSim,
          };
          this.dataRestorerInformation = dataSim;
          this.modalOpen(this.modalItem, this.dataRestorerInformation);
        } else{
          this.imageFront = null;
          this.imageBack = null;
          this.imageSelfie = null;
          this.alertService.showMess('Không nhận diện được giấy tờ, vui lòng thử lại!');
        }
        this.itemBlockUI.stop();
      },
      (err) => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      }
    );
  }
}
