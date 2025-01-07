import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "app/auth/service";

@Component({
  selector: "app-view-check-info-new",
  templateUrl: "./view-check-info-new.component.html",
  styleUrls: ["./view-check-info-new.component.scss"],
})
export class ViewCheckInfoNewComponent implements OnInit {
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() select;
  @Input() data;
  @Input() taskIdOld;
  @Input() mobileSearch;
  dataUserOld;
  formOgzOcr;
  dataImage;
  listVideo;
  showSubmit = false;
  listImage;
  cacheKey;
  public selectedFilesVideo: File[] = [];
  public selectedFilesImage: File[] = [];
  public selectedFilesPdf: File[] = [];
  public selectedFiles: File[] = [];
  public modalRef: any;
  @ViewChild("modalItem") modalItem: ElementRef;
  @BlockUI("view-check-info-new-block") itemBlockUI: NgBlockUI;

  constructor(
    private alertService: SweetAlertService,
    private userService: UserService,
    private telecomService: TelecomService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log("data-app-view-check-info-new", this.data);
    console.log("this.select", this.select);
    console.log("this.mobileSearch", this.mobileSearch);
    this.getData();
    this.initForm();
  }

  getData() {
    this.itemBlockUI.start();
    this.telecomService.getDetailTask(this.taskIdOld, 1).subscribe(
      (res) => {
        if (res.status == 1) {
          this.itemBlockUI.stop();
          this.dataUserOld = res.data?.customer;
          console.log(this.dataUserOld);

          // if(this.data.organization.base64LiceseFile) {
          //   this.urlFileDKKD = this.commonService.base64ToArrayBuffer(this.data.organization.base64LiceseFile)
          // }
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

  // onChangeIdentificationType(event) {
  //   let id = event.target.value
  //   if (id == "CCCD" || id == "CCCD_CHIP") {
  //     this.formPeople.patchValue({
  //       identification_place: "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI"
  //     })
  //   } else {
  //     this.formPeople.patchValue({
  //       identification_place: ""
  //     })
  //   }

  // }

  modalClose() {
    this.modalRef.close();
  }

  async modalOpen(modal, item = null) {
    this.dataImage = item;
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: "modal modal-primary",
      size: "l",
      backdrop: true,
      keyboard: true,
    });
  }

  deleteFile(index, name) {
    console.log(index);
    if (name == "video") {
      if (index >= 0 && index < this.selectedFilesVideo.length) {
        this.selectedFilesVideo.splice(index, 1);
      }
    } else if (name == "image") {
      if (index >= 0 && index < this.selectedFilesImage.length) {
        this.selectedFilesImage.splice(index, 1);
      }
    } else {
      if (index >= 0 && index < this.selectedFilesPdf.length) {
        this.selectedFilesPdf.splice(index, 1);
      }
    }
  }

  onFileSelected(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      files.forEach((file) => {
        if (file.size > 0) {
          if (name === "video") {
            this.selectedFilesVideo.push(file);
            console.log(this.selectedFilesVideo);
          } else if (name === "image") {
            this.selectedFilesImage.push(file);
            console.log(this.selectedFilesImage);
          } else {
            if (file.type === "application/pdf" || file.type === "pdf") {
              this.selectedFilesPdf.push(file);
              console.log(this.selectedFilesPdf);
            }
          }
        }
      });
    }
  }

  async onSubmitUpload() {
    if (
      this.selectedFilesImage.length <= 0 &&
      this.selectedFilesVideo.length <= 0 &&
      this.selectedFilesPdf.length <= 0
    ) {
      this.alertService.showMess("Vui lòng không để trống tệp");
      return;
    }
    this.selectedFiles = this.selectedFilesImage.concat(this.selectedFilesVideo, this.selectedFilesPdf);
    if (this.selectedFiles.length > 11) {
      this.alertService.showMess("Vui lòng xóa bớt tệp. Bạn chỉ được chọn tối đa 11 tệp");
      return;
    }
    if (this.selectedFiles.length > 0 && this.selectedFiles.length <= 11) {
      const formData = new FormData();
      // formData.append("entity", "people");
      // formData.append("key", "attachments");
      formData.append("task_id", this.data.task_id);
      formData.append("action", 'change_user_info');
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        formData.append(`files`, file);
      }
      console.log(formData);
      this.itemBlockUI.start();
      await this.telecomService.postUpdateAttachments(formData).subscribe(
        (res) => {
          console.log(res);
          if (!res.status) {
            this.itemBlockUI.stop();
            this.alertService.showMess(res.message);
            return;
          }
          this.showSubmit = true;
          this.cacheKey = res.data.cacheKey;
          this.itemBlockUI.stop();
        },
        (error) => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        }
      );
    }
  }

  initForm() {
    this.formOgzOcr = this.formBuilder.group({
      businessName: [
        this.data?.image?.business?.businessName
          ? this.data?.image?.business?.businessName
          : "",
        Validators.required,
      ],
      businessCode: [
        this.data?.image?.business?.businessCode
          ? this.data?.image?.business?.businessCode
          : "",
        Validators.required,
      ],

      representativeName: [
        this.data?.data?.authorizer?.name
          ? this.data?.data?.authorizer?.name
          : "",
        Validators.required,
      ],
      cardFrontAuthorizer: [
        this.data?.image?.business?.card_front_authorizer
          ? this.data?.image?.business?.card_front_authorizer
          : "",
        Validators.required,
      ],
      cardBackAuthorizer: [
        this.data?.image?.business?.card_back_authorizer
          ? this.data?.image?.business?.card_back_authorizer
          : "",
        Validators.required,
      ],
      selfieAuthorizer: [
        this.data?.image?.business?.selfie_authorizer
          ? this.data?.image?.business?.selfie_authorizer
          : "",
        Validators.required,
      ],
      identificationTypeAuthorizer: [
        this.data?.data?.authorizer?.type
          ? this.data?.data?.authorizer?.type == "CC"
            ? "CAN_CUOC"
            : this.data?.data?.authorizer?.type
          : "",
        Validators.required,
      ],
      identificationNoAuthorizer: [
        this.data?.data?.authorizer?.id ? this.data?.data?.authorizer?.id : "",
        Validators.required,
      ],
      identificationDateAuthorizer: [
        this.data?.data?.authorizer?.issue_date
          ? this.data?.data?.authorizer?.issue_date
          : "",
        Validators.required,
      ],
      identificationPlaceAuthorizer: [
        this.data?.data?.authorizer?.issue_loc
          ? this.data?.data?.authorizer?.issue_loc
          : "",
        Validators.required,
      ],
      birthAuthorizer: [
        this.data?.data?.authorizer?.dob
          ? this.data?.data?.authorizer?.dob
          : "",
        Validators.required,
      ],
      fullAddressAuthorizer: [
        this.data?.data?.authorizer?.address
          ? this.data?.data?.authorizer?.address
          : "",
        Validators.required,
      ],

      userFullName: [
        this.select.id != 1
          ? this.data?.data?.name
          : this.data?.data?.user?.name,
        Validators.required,
      ],
      identificationTypeUser: [
        this.select.id != 1
          ? this.data?.data?.type == "CC"
            ? "CAN_CUOC"
            : this.data?.data?.type
          : this.data?.data?.user?.type == "CC"
            ? "CAN_CUOC"
            : this.data?.data?.user?.type,
        Validators.required,
      ],
      identificationNoUser: [
        this.select.id != 1 ? this.data?.data?.id : this.data.data.user.id,
        Validators.required,
      ],
      identificationDateUser: [
        this.select.id != 1
          ? this.data?.data?.issue_date
          : this.data?.data?.user?.issue_date,
        Validators.required,
      ],
      identificationPlaceUser: [
        this.select.id != 1
          ? this.data?.data?.issue_loc
          : this.data?.data?.user?.issue_loc,
        Validators.required,
      ],
      birthUser: [
        this.select.id != 1 ? this.data?.data?.dob : this.data?.data?.user?.dob,
        Validators.required,
      ],
      fullAddressUser: [
        this.select.id != 1
          ? this.data?.data?.address
          : this.data?.data?.user?.address,
        Validators.required,
      ],
    });
  }

  async submit() {
    let data;
    console.log(this.formOgzOcr);
    const regex = /^.*base64,/i;
    if (!this.formOgzOcr.value.identificationTypeUser) {
      this.alertService.showMess(
        "Vui lòng chọn loại thẻ căn cước người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.identificationNoUser) {
      this.alertService.showMess(
        "Vui lòng không để trống số giấy tờ người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.identificationDateUser) {
      this.alertService.showMess(
        "Vui lòng không để trống ngày cấp người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.identificationPlaceUser) {
      this.alertService.showMess(
        "Vui lòng không để trống nơi cấp người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.userFullName) {
      this.alertService.showMess(
        "Vui lòng không để trống họ và tên người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.birthUser) {
      this.alertService.showMess(
        "Vui lòng không để trống ngày sinh người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.fullAddressUser) {
      this.alertService.showMess(
        "Vui lòng không để trống địa chỉ người sử dụng"
      );
      return;
    }
    if (this.select.id == 0) {
      data = {
        task_id: this.data.task_id,
        customer_type: "PERSONAL",
        msisdn: this.mobileSearch,
        people: {
          identification_type: this.formOgzOcr.value.identificationTypeUser,
          identification_no: this.formOgzOcr.value.identificationNoUser,
          identification_date: Math.floor(
            new Date(
              this.formOgzOcr.value.identificationDateUser
                .split("-")
                .reverse()
                .join("-")
            ).getTime() / 1000
          ),
          identification_place: this.formOgzOcr.value.identificationPlaceUser,
          name: this.formOgzOcr.value.userFullName,
          birth: Math.floor(
            new Date(
              this.formOgzOcr.value.birthUser.split("-").reverse().join("-")
            ).getTime() / 1000
          ),
          mobile: this.mobileSearch,
          full_address: this.formOgzOcr.value.fullAddressUser,
          identification_front_file: this.data?.image?.personal?.card_front,
          identification_back_file: this.data?.image?.personal?.card_back,
          identification_selfie_file: this.data?.image?.personal?.selfie
        },
      };
    } else {
      if (!this.formOgzOcr.value.identificationTypeAuthorizer) {
        this.alertService.showMess(
          "Vui lòng chọn loại thẻ căn cước người đại diện"
        );
        return;
      }
      if (!this.formOgzOcr.value.identificationNoAuthorizer) {
        this.alertService.showMess(
          "Vui lòng không để trống số giấy tờ người đại diện"
        );
        return;
      }
      if (!this.formOgzOcr.value.identificationDateAuthorizer) {
        this.alertService.showMess(
          "Vui lòng không để trống ngày cấp người đại diện"
        );
        return;
      }
      if (!this.formOgzOcr.value.identificationPlaceAuthorizer) {
        this.alertService.showMess(
          "Vui lòng không để trống nơi cấp người đại diện"
        );
        return;
      }
      if (!this.formOgzOcr.value.representativeName) {
        this.alertService.showMess(
          "Vui lòng không để trống họ và tên người đại diện"
        );
        return;
      }
      if (!this.formOgzOcr.value.birthAuthorizer) {
        this.alertService.showMess(
          "Vui lòng không để trống ngày sinh người đại diện"
        );
        return;
      }
      if (!this.formOgzOcr.value.fullAddressAuthorizer) {
        this.alertService.showMess(
          "Vui lòng không để trống địa chỉ người đại diện"
        );
        return;
      }
      data = {
        task_id: this.data.task_id,
        customer_type: "ORGANIZATION",
        msisdn: this.mobileSearch,
        people: {
          identification_type: this.formOgzOcr.value.identificationTypeUser,
          identification_no: this.formOgzOcr.value.identificationNoUser,
          identification_date: Math.floor(
            new Date(
              this.formOgzOcr.value.identificationDateUser
                .split("-")
                .reverse()
                .join("-")
            ).getTime() / 1000
          ),
          identification_place: this.formOgzOcr.value.identificationPlaceUser,
          name: this.formOgzOcr.value.userFullName,
          birth: Math.floor(
            new Date(
              this.formOgzOcr.value.birthUser.split("-").reverse().join("-")
            ).getTime() / 1000
          ),
          mobile: this.mobileSearch,
          full_address: this.formOgzOcr.value.fullAddressUser,
          identification_front_file:
            this.data?.image?.business?.card_front_user,
          identification_back_file: this.data?.image?.business?.card_back_user,
          identification_selfie_file: this.data?.image?.business?.selfie_user,
        },
        organization: {
          name: this.data?.image?.business?.businessName,
          id_type: "LICENSE",
          full_address: this.data?.image?.business?.businessAddress,
          id_no: this.data?.image?.business?.businessCode,
          license_file:
            this.data?.registerBusiness?.imgageRegisterBusiness.replace(
              regex,
              ""
            ),
          license_no: '99999',
          name_international: this.data?.image?.business?.businessName,
          short_name: this.data?.image?.business?.businessName,
        },
        representative: {
          identification_type:
            this.formOgzOcr.value.identificationTypeAuthorizer,
          identification_no: this.formOgzOcr.value.identificationNoAuthorizer,
          identification_date: Math.floor(
            new Date(
              this.formOgzOcr.value.identificationDateAuthorizer
                .split("-")
                .reverse()
                .join("-")
            ).getTime() / 1000
          ),
          identification_place:
            this.formOgzOcr.value.identificationPlaceAuthorizer,
          name: this.formOgzOcr.value.representativeName,
          birth: Math.floor(
            new Date(
              this.formOgzOcr.value.birthAuthorizer
                .split("-")
                .reverse()
                .join("-")
            ).getTime() / 1000
          ),
          mobile: this.mobileSearch,
          full_address: this.formOgzOcr.value.fullAddressAuthorizer,
          identification_front_file:
            this.data?.image?.business?.card_front_authorizer,
          identification_back_file:
            this.data?.image?.business?.card_back_authorizer,
          identification_selfie_file:
            this.data?.image?.business?.selfie_authorizer,
        },
        delegation: {
          delegation_no: "555555555",
          delegation_file:
            this.data?.powerOfAttorney?.imagePowerOfAttorney.replace(regex, ""),
          delegation_date: "1625875200",
          delegation_type: "MOBILE",
        }
      };
    }
    try {
      data.cacheKey = this.cacheKey;
      console.log("cacheKey", this.cacheKey);
      this.itemBlockUI.start();
      this.telecomService.postOwnershipTransfer(data).subscribe(
        (res) => {
          if (res.status == 1) {
            this.itemBlockUI.stop();
            this.alertService.showMess(
              "Chuyển đổi chủ quyền cho thuê bao " +
              this.mobileSearch +
              " thành công"
            );
            this.closePopup.next();
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
    } catch (error) {
      this.alertService.showError(error);
    }
  }
}
