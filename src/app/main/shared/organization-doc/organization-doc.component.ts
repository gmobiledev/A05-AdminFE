import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'app/utils/common.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-organization-doc',
  templateUrl: './organization-doc.component.html',
  styleUrls: ['./organization-doc.component.scss']
})
export class OrganizationDocComponent implements OnInit {

  @Input() submitted;

  form: FormGroup;
  public license_file;
  public imageFront;
  public imageBack;
  public imageSelfie;

  constructor(
    private formBuilder: FormBuilder,
    private readonly alertService: SweetAlertService,
    private readonly commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {      
    }
  }

  async onSelectFileLicense(event) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]
      console.log(file);
      if (["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)) {
        this.license_file = file
        if (file.type == "application/pdf") {
          const regex = /^.*base64,/i;
          let x = ((await this.commonService.fileUploadToBase64(this.license_file))+'').replace(regex, '');
                    
          console.log('base64', x);
          this.form.controls['license_extension'].setValue("pdf");
          this.form.controls['license_file'].setValue(x);
          console.log(this.form.value);
        } else{
          this.alertService.showError("Chỉ chấp nhận file Scan PDF")
          this.license_file = ""
        }
      } else {
        this.alertService.showError("Chỉ chấp nhận dạng ảnh png, jpg và pdf", 30000)
        this.license_file = "";
      }
    }
  }
  
  initForm() {
    this.form = this.formBuilder.group({
      // license_no: ['', Validators.required],
      // id_type: "LICENSE",
      // customer_type: 'ORGANIZATION',
      // identification_no: ['', Validators.required],
      // identification_type: ['', Validators.required],
      license_file: ['', Validators.required],
      license_extension: ['', Validators.required],
      // identification_back_file: ['', Validators.required],
      // identification_front_file: ['', Validators.required],
      // identification_selfie_file: ['', Validators.required],
    })
  }

}
