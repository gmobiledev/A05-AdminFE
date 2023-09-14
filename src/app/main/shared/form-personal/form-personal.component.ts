import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss']
})
export class FormPersonalComponent implements OnInit {

  formPeople: FormGroup;
  @Input() submitted;
  @Input() options: string = ''

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  onChangeDistrict(e) {

  }

  onChangeProvince(e) {

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
