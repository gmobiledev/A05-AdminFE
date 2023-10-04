import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})


export class ViewCustomerComponent implements OnInit {

  formPeople: FormGroup;
  @Input() submitted;
  @Input() options: string = ''
  public contentHeader: any;

  public countries = []
  public provinces = []
  public residence_districts = []
  public residence_commues = []
  public home_districts = []
  public home_commues = []
  public residence: any = {}
  public imageFront;
  public imageBack;
  public imageSelfie;  

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.contentHeader = {
      headerTitle: 'Danh sách khách hàng',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Danh sách khách hàng',
            isLink: true,
            link: '/customer/list'
          },
          {
            name: 'Chi tiết',
            isLink: false
          }
        ]
      }
    };
  }

  onChangeResidenceProvince(event) {
    console.log(event.target);
    if (event.target['options'])
      this.residence['province'] = event.target['options'][event.target['options'].selectedIndex].text;
    let id = event.target.value
    // this.adminSerivce.getDistricts(id).subscribe((res: any) => {
    //   if (res.status == 1) {
    //     this.residence_districts = res.data
    //     this.residence_commues = []
    //   }
    // })
  }

  onChangeResidenceDistrict(event) {
    if (event.target['options'])
      this.residence['district'] = event.target['options'][event.target['options'].selectedIndex].text;
    let id = event.target.value
    // this.adminSerivce.getCommunes(id).subscribe((res: any) => {
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
    let id = event.target.value
    // this.adminSerivce.getDistricts(id).subscribe((res: any) => {
    //   if (res.status == 1) {
    //     this.home_districts = res.data
    //     this.home_commues = []
    //   }
    // })
  }

  onChangeHomeDistrict(event) {
    let id = event.target.value
    // this.adminSerivce.getCommunes(id).subscribe((res: any) => {
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

  get f() {
    return this.formPeople.controls;
  }

  initForm() {
    this.formPeople = this.formBuilder.group({
      name: ['', Validators.required],
      birth: ['', [Validators.required]],
      gender: ['', Validators.required],
      country: ['VN', Validators.required],
      identification_no: ['', Validators.required],
      identification_place: ['', Validators.required],
      identification_back_file: [''],
      identification_front_file: [''],
      identification_selfie_file: [''],
      identification_date: ['', Validators.required],
      identification_type: ['', Validators.required],
      identification_expire_date: [""],
      home_country: ['VN', Validators.required], //Có trường người nước noài
      home_province: [''],
      home_district: [''],
      home_commune: [''],
      home_address: [''],
      residence_province: ['', Validators.required],
      residence_district: ['', Validators.required],
      residence_commune: ['',Validators.required],
      residence_address: [''], //Có trường hợp CCCD không có địa chỉ thường chú
      residence_full_address: [''],
      province: ['1'],
      district: ['1'],
      commune: ['1'],
      address: ['1'],
      otpions: [this.options], //any
      mobile: [''],
    })

  }

}

