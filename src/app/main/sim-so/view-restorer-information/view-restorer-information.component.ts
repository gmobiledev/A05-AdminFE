import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { CommonDataService } from "app/auth/service/common-data.service";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-view-restorer-information",
  templateUrl: "./view-restorer-information.component.html",
  styleUrls: ["./view-restorer-information.component.scss"],
})
export class ViewRestorerInformationComponent implements OnInit {
  @Input() data: any;
  @Input() provinces;
  formOgzOcr;
  districts;
  wards;
  @BlockUI("section-block") itemBlockUI: NgBlockUI;
  @Output() closePopup = new EventEmitter<boolean>();

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private commonDataService: CommonDataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  timeStamp(time) {
    const myDate = time?.split("-");
    const newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
    const timeStamp = Math.floor(newDate.getTime() / 1000);
    return timeStamp;
  }

  initForm() {
    this.formOgzOcr = this.formBuilder.group({
      district: [this.data?.address_entities?.district, Validators.required],
      district_code: [
        parseInt(this.data?.address_entities?.district_code),
        Validators.required,
      ],
      ward_code: [
        parseInt(this.data?.address_entities?.ward_code),
        Validators.required,
      ],
      ward: [this.data?.address_entities?.ward, Validators.required],
      province: [this.data?.address_entities?.province, Validators.required],
      province_code: [
        parseInt(this.data?.address_entities?.province_code),
        Validators.required,
      ],
      name: [this.data?.name, Validators.required],
      identificationType: [
        this.data?.type == "CC" ? "CAN_CUOC" : this.data?.type,
        Validators.required,
      ],
      gender: [this.data?.sex, Validators.required],
      identificationNo: [this.data?.id, Validators.required],
      identificationDate: [this.data?.issue_date, Validators.required],
      identificationPlace: [this.data?.issue_loc, Validators.required],
      birth: [this.data?.dob, Validators.required],
      doe: [this.data?.doe, Validators.required],
      street: [this.data?.address_entities?.street, Validators.required],
      
    });
    if (this.formOgzOcr?.value?.province_code) {
      this.onChangeResidenceProvince(
        this.formOgzOcr?.value?.province_code,
        true
      );
    }
  }

  onChangeResidenceProvince(id, init = null) {
    const idProvince = this.formOgzOcr?.value?.province_code;
    if (this.provinces.length > 0) {
      this.formOgzOcr.patchValue({
        province: this.provinces.find((item) => item.id == idProvince).title,
        province_code: this.provinces.find((item) => item.id == idProvince).id,
      });
    }
    this.commonDataService.getDistricts(idProvince).subscribe((res: any) => {
      if (res.status == 1) {
        if (!init) {
          // this.formOgzOcr.controls["ward_code"].setValue("");
          // this.formOgzOcr.controls["ward"].setValue("");
          // this.formOgzOcr.controls["district_code"].setValue("");
          // this.formOgzOcr.controls["district"].setValue("");
        }
        this.districts = res.data;
        if (this.districts && init) {
          this.onChangeResidenceDistrict(
            this.formOgzOcr.value.district_code,
            true
          );
        }
        this.wards = [];
      }
    });
  }

  onChangeResidenceDistrict(id, init = null) {
    let idDistrict = this.formOgzOcr?.value.district_code;
    if (this.districts.length > 0) {
      this.formOgzOcr.patchValue({
        district: this.districts.find((item) => item.id == idDistrict).title,
        district_code: this.districts.find((item) => item.id == idDistrict).id,
      });
    }
    this.commonDataService.getCommunes(idDistrict).subscribe((res: any) => {
      if (res.status == 1) {
        if (!init) {
          // this.formOgzOcr.controls["ward_code"].setValue("");
          // this.formOgzOcr.controls["ward"].setValue("");
        }
        this.wards = res.data;
        if (this.wards && init) {
          this.onChangeResidenceCommune(this.formOgzOcr.value.ward_code);
        }
      }
    });
  }

  onChangeResidenceCommune(event) {
    const idWard = this.formOgzOcr.value.ward_code;
    if (this.wards.length > 0) {
      this.formOgzOcr.patchValue({
        ward: this.wards.find((item) => item.id == idWard).title,
        ward_code: this.wards.find((item) => item.id == idWard).id,
      });
      console.log(this.formOgzOcr);
      
    }
    
  }

  submit() {
    if (!this.formOgzOcr.value.identificationType) {
      this.alertService.showMess(
        "Vui lòng chọn loại thẻ căn cước người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.identificationNo) {
      this.alertService.showMess(
        "Vui lòng không để trống số giấy tờ người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.identificationDate) {
      this.alertService.showMess(
        "Vui lòng không để trống ngày cấp người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.identificationPlace) {
      this.alertService.showMess(
        "Vui lòng không để trống nơi cấp người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.name) {
      this.alertService.showMess(
        "Vui lòng không để trống họ và tên người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.gender) {
      this.alertService.showMess(
        "Vui lòng không để trống giới tính người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.birth) {
      this.alertService.showMess(
        "Vui lòng không để trống ngày sinh người sử dụng"
      );
      return;
    }
    if (!this.formOgzOcr.value.street) {
      this.alertService.showMess(
        "Vui lòng không để trống địa chỉ thôn, số nhà"
      );
      return;
    }
    if (!this.formOgzOcr.value.province_code) {
      this.alertService.showMess("Vui lòng không để trống địa chỉ tỉnh/thành");
      return;
    }
    if (!this.formOgzOcr.value.district_code) {
      this.alertService.showMess("Vui lòng không để trống địa chỉ quận/huyện");
      return;
    }
    if (!this.formOgzOcr.value.ward_code) {
      this.alertService.showMess("Vui lòng không để trống địa chỉ xã/phường");
      return;
    }
    if (!this.formOgzOcr.value.doe) {
      this.alertService.showMess("Vui lòng không để trống ngày hết hạn");
      return;
    }
    const address = `${this.formOgzOcr.value.street}, ${this.formOgzOcr.value.ward}, ${this.formOgzOcr.value.district}, ${this.formOgzOcr.value.province}`;
    const data = {
      task_id: this.data.task_id,
      identification_type: this.formOgzOcr.value.identificationType,
      name: this.formOgzOcr.value.name,
      identification_no: this.formOgzOcr.value.identificationNo,
      birth: this.timeStamp(this.formOgzOcr.value.birth),
      gender: this.formOgzOcr.value.gender,
      country: this.data.nationality,
      home_country: this.data.nationality,
      home_province: parseInt(this.formOgzOcr.value.province_code),
      home_district: parseInt(this.formOgzOcr.value.district_code),
      home_commune: parseInt(this.formOgzOcr.value.ward_code),
      residence_province: parseInt(this.formOgzOcr.value.province_code),
      residence_district: parseInt(this.formOgzOcr.value.district_code),
      residence_commune: parseInt(this.formOgzOcr.value.ward_code),
      residence_address: address,
      identification_expire_date: this.timeStamp(this.formOgzOcr.value.doe),
      identification_date: this.timeStamp(
        this.formOgzOcr.value.identificationDate
      ),
      identification_place: this.formOgzOcr.value.identificationPlace,
      full_address: address
    };
    
    this.itemBlockUI.start();
    this.telecomService.postSubmitRecoverySim(data).subscribe(
      (res) => {
        if (res.status === 1) {
          this.closePopup.next();
          this.alertService.showMess(res.message);
        } else {
          this.alertService.showMess(res.message);
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
