import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { CommonService } from 'app/utils/common.service';

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss']
})
export class FormPersonalComponent implements OnInit, OnChanges  {

  formPeople: FormGroup;
  @Input() submitted;
  @Input() options: string = ''

  @Input() countries;
  @Input() provinces; //thuong tru
  @Input() dataInput;

  public residence_districts;
  public residence_commues;
  public home_districts;
  public home_commues;
  public residence;
  public imageFront;
  public imageBack;
  public imageSelfie;  

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private commonDataService: CommonDataService
  ) { }

  ngOnInit(): void {

    
    this.initForm();
  }

  ngOnChanges() {
    this.formPeople.controls.name.setValue(this.dataInput.name)
    this.formPeople.controls.mobile.setValue(this.dataInput.mobile)
    this.formPeople.controls.identification_type.setValue(this.dataInput.id_type)
    this.formPeople.controls.residence_full_address.setValue(this.dataInput.people.full_address)
    this.formPeople.controls.identification_place.setValue(this.dataInput.people.identification_place)
    this.formPeople.controls.identification_no.setValue(this.dataInput.id_no)
    this.formPeople.controls.home_country.setValue(this.dataInput.people.country)
    this.formPeople.controls.gender.setValue(this.dataInput.people.gender)

    this.formPeople.controls.birth_text.setValue(this.dataInput.people.birth)
    this.formPeople.controls.identification_date_text.setValue(this.dataInput.people.created_at)
    this.formPeople.controls.identification_expire_date_text.setValue(this.dataInput.people.identification_expire_date)
    this.formPeople.controls.home_province.setValue(this.dataInput.people.home_province)
    this.formPeople.controls.residence_address.setValue(this.dataInput.address)
    this.formPeople.controls.residence_province.setValue(this.dataInput.people.home_province)

    this.formPeople.controls.country.setValue(this.dataInput.people.country)



    console.log(this.dataInput)
  } 

  onChangeResidenceProvince(event) {    
    // let id = event.target.value
    // this.commonDataService.getDistricts(id).subscribe((res: any) => {
    //   if (res.status == 1) {
    //     this.residence_districts = res.data
    //     this.residence_commues = []
    //   }
    // })
  }

  onChangeResidenceDistrict(event) {    
    // let id = event.target.value
    // this.commonDataService.getCommunes(id).subscribe((res: any) => {
    //   if (res.status == 1) {
    //     this.residence_commues = res.data
    //   }
    // })
  }
  onChangeResidenceCommune(event) {
    if (event.target['options'])
      this.residence['commune'] = event.target['options'][event.target['options'].selectedIndex].text;
  }

  onChangeHomeProvince(event) {
    // let id = event.target.value
    // this.commonDataService.getDistricts(id).subscribe((res: any) => {
    //   if (res.status == 1) {
    //     this.home_districts = res.data
    //     this.home_commues = []
    //   }
    // })
  }

  onChangeHomeDistrict(event) {
    // let id = event.target.value
    // this.commonDataService.getCommunes(id).subscribe((res: any) => {
    //   if (res.status == 1) {
    //     this.home_commues = res.data
    //   }
    // })
  }

  onChangeIdentificationType(event) {
    let id = event.target.value
    if (id == "CCCD" || id == "CCCD_CHIP") {
      this.formPeople.patchValue({
        identification_place: "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI"
      })
    } else {
      this.formPeople.patchValue({
        identification_place: ""
      })
    }

  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.formPeople.controls['identification_front_file'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.formPeople.controls['identification_back_file'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.formPeople.controls['identification_selfie_file'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  async onSelectFileSignature(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.formPeople.controls['signature'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  get f() {
    return this.formPeople.controls;
  }

  initForm() {
    this.formPeople = this.formBuilder.group({
      name: ['', Validators.required],
      birth: ['', [Validators.required]],
      birth_text: ['', [Validators.required]],
      gender: ['', Validators.required],
      country: ['VN', Validators.required],
      identification_no: ['', Validators.required],
      identification_place: ['', Validators.required],
      identification_back_file: [''],
      identification_front_file: [''],
      identification_selfie_file: [''],
      identification_date: ['', Validators.required],
      identification_date_text: ['', Validators.required],
      identification_type: ['', Validators.required],
      identification_expire_date: [""],
      identification_expire_date_text: [""],
      home_country: ['VN', Validators.required], //Có trường người nước noài
      home_province: ['-1'],
      home_district: ['-1'],
      home_commune: ['-1'],
      home_address: [''],
      residence_province: ['-1'],
      residence_district: ['-1'],
      residence_commune: ['-1'],
      residence_address: [''], //Có trường hợp CCCD không có địa chỉ thường chú
      residence_full_address: [''],
      province: ['-1'],
      district: ['-1'],
      commune: ['-1'],
      address: [''],
      otpions: [this.options], //any
      mobile: [''],
      signature: ['']
    })

  }

}
