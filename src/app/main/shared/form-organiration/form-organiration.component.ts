import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'app/auth/service/admin.service';
import { CommonService } from 'app/utils/common.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-form-organiration',
  templateUrl: './form-organiration.component.html',
  styleUrls: ['./form-organiration.component.scss']
})
export class FormOrganirationComponent implements OnInit, OnChanges {

  formOrganization: FormGroup;
  @Input() submitted;
  @Input() provinces;
  @Input() districts;
  @Input() commues;
  @Input() countries;
  delegation_file;
  @Input() dataInput;

  constructor(
    private formBuilder: FormBuilder,
    private readonly alertService: SweetAlertService,
    private readonly commonService: CommonService,
    private adminSerivce: AdminService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.formOrganization.controls;
  }
  
  onChangeProvince(event) {
    let id = event.target.value
    this.adminSerivce.getDistricts(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.districts = res.data
        this.commues = []
      }
    });
    const currentProvine = this.provinces.find(x => x.id == id);
    this.formOrganization.controls['full_address'].setValue(currentProvine.title);
  }

  onChangeDistrict(event) {
    let id = event.target.value
    this.adminSerivce.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.commues = res.data
      }
    });
    const currentDistrict = this.districts.find(x => x.id == id);
    console.log("currentDistrict", currentDistrict);
    const fullAddress = (currentDistrict ? currentDistrict.title + ',' : '') + this.formOrganization.controls['full_address'].value;
    this.formOrganization.controls['full_address'].setValue(fullAddress);
  }

  onChangeCommnue(event) {
    let id = event.target.value
    const currentCommnue = this.commues.find(x => x.id == id);
    const fullAddress = (currentCommnue ? currentCommnue.title + ',' : '') + this.formOrganization.controls['full_address'].value;
    this.formOrganization.controls['full_address'].setValue(fullAddress);
  }

  async onSelectFileDelegation(event) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]
      this.delegation_file = file
      if (["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)) {
        if (file.type == "application/pdf") {
          this.formOrganization.controls['delegation_extension'].setValue("pdf");
        } else {
          this.formOrganization.controls['delegation_extension'].setValue("png");
        }
        let x = await this.commonService.fileUploadToBase64(this.delegation_file);
        const regex = /^.*base64,/i;
        this.formOrganization.controls['delegation_file'].setValue(x.toString().replace(regex, ''))
          
      } else {
        this.alertService.showError("Chỉ chấp nhận dạng ảnh png, jpg và pdf", 30000)
      }
    }
  }

  initForm() {
    this.formOrganization = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      name_international: ['', Validators.required],
      short_name: ['', Validators.required],
      license_no: ['', Validators.required],
      license_issue_date: ['', Validators.required],
      license_issue_place: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      commune: ['', Validators.required],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      type: ['ORG_PRIVATE', Validators.required],
      delegation_file: [''],
      delegation_extension: [''],
      delegation_date: [''],
      delegation_no: [''],
      delegation_type: ['delegation_type'],
      isDelegation: [false],
      position: [''],
      full_address: [''],
      id_type: ["LICENSE"]
    })
  }

  ngOnChanges() {
    this.initForm();
    if (this.dataInput && this.dataInput.organization && !this.formOrganization.controls.license_no.value) {
      this.formOrganization.controls.name.setValue(this.dataInput.organization.name);
      this.formOrganization.controls.name_international.setValue(this.dataInput.organization.name_international);  
      this.formOrganization.controls.short_name.setValue(this.dataInput.organization.short_name);  
      this.formOrganization.controls.address.setValue(this.dataInput.organization.address);
      this.formOrganization.controls.license_no.setValue(this.dataInput.organization.id_no);  
      this.formOrganization.controls.mobile.setValue(this.dataInput.mobile);  
      this.formOrganization.controls.license_issue_place.setValue(this.dataInput.organization.license_issue_place);  

    }
  }

}
