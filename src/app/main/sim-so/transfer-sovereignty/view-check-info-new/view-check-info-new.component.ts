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

@Component({
  selector: "app-view-check-info-new",
  templateUrl: "./view-check-info-new.component.html",
  styleUrls: ["./view-check-info-new.component.scss"],
})
export class ViewCheckInfoNewComponent implements OnInit {
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() select;
  @Input() data;
  dataUserOld;
  mobileSearch;
  formOgzOcr;
  dataImage;
  public modalRef: any;
  @ViewChild("modalItem") modalItem: ElementRef;
  @BlockUI("section-block") itemBlockUI: NgBlockUI;

  constructor(
    private alertService: SweetAlertService,
    private telecomService: TelecomService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log("data-app-view-check-info-new", this.data);
    console.log("this.select", this.select);

    this.getData();
    this.initForm();
  }

  getData() {
    this.itemBlockUI.start();
    this.telecomService.getDetailTask(this.data.task_id, 1).subscribe(
      (res) => {
        if (res.status == 1) {
          this.itemBlockUI.stop();
          this.mobileSearch = res.data?.task?.msisdn;
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

  initForm() {
    this.formOgzOcr = this.formBuilder.group({
      businessName: ["", Validators.required],
      businessCode: ["", Validators.required],

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
          ? this.data?.data?.authorizer?.type
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
          ? this.data?.data?.type
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

  submit() {
    let data;
    console.log(this.formOgzOcr);
    
    if (this.select.id == 0) {
      if (!this.data?.image?.personal?.card_back) {
        this.alertService.showMess(
          "Vui lòng không để chống ảnh CMND/CCCD mặt sau"
        );
        return;
      }
      if (!this.data?.image?.personal?.card_front) {
        this.alertService.showMess(
          "Vui lòng không để chống ảnh CMND/CCCD mặt trước"
        );
        return;
      }
      if (!this.data?.image?.personal?.selfie) {
        this.alertService.showMess("Vui lòng không để chống ảnh chân dung");
        return;
      }
      if (!this.formOgzOcr.value.identificationTypeUser) {
        this.alertService.showMess("Vui lòng chọn loại thẻ căn cước");
        return;
      };
      if (!this.formOgzOcr.value.identificationNoUser) {
        this.alertService.showMess(
          "Vui lòng không để chống số giấy tờ"
        );
        return;
      }
      if (!this.formOgzOcr.value.identificationDateUser) {
        this.alertService.showMess("Vui lòng không để chống ngày cấp");
        return;
      }
      if (!this.formOgzOcr.value.identificationPlaceUser) {
        this.alertService.showMess("Vui lòng không để chống nơi cấp");
        return;
      }
      if (!this.formOgzOcr.value.userFullName) {
        this.alertService.showMess(
          "Vui lòng không để chống họ và tên"
        );
        return;
      }
      if (!this.formOgzOcr.value.birthUser) {
        this.alertService.showMess("Vui lòng không để chống ngày sinh");
        return;
      }
      if (!this.formOgzOcr.value.fullAddressUser) {
        this.alertService.showMess("Vui lòng không để chống địa chỉ");
        return;
      }
      data = {
        task_id: this.data.task_id,
        customer_type: "PERSONAL",
        people: {
          identification_type: this.formOgzOcr.value.identificationTypeUser,
          identification_no: this.formOgzOcr.value.identificationNoUser,
          identification_date: this.formOgzOcr.value.identificationDateUser,
          identification_place: this.formOgzOcr.value.identificationPlaceUser,
          name: this.formOgzOcr.value.userFullName,
          birth: this.formOgzOcr.value.birthUser,
          mobile: this.mobileSearch,
          full_address: this.formOgzOcr.value.fullAddressUser,
          identification_front_file:
            this.data?.image?.personal?.card_front,
          identification_back_file:
            this.data?.image?.personal?.card_back,
          identification_selfie_file:
            this.data?.image?.personal?.selfie,
        },
      };
    }
    this.itemBlockUI.start();
    this.telecomService.postOwnershipTransfer(data).subscribe(
      (res) => {
        if (res.status == 1) {
          this.itemBlockUI.stop();
          this.alertService.showMess(res.message);
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
  }
}
