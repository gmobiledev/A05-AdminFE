import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/auth/service/admin.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-create-inventory-manager',
  templateUrl: './create-inventory-manager.component.html',
  styleUrls: ['./create-inventory-manager.component.scss']
})
export class CreateInventoryManagerComponent implements OnInit {
  public contentHeader: any =  {
    headerTitle: 'Thêm QL kho',
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
          name: 'Danh sách QL kho',
          isLink: true,
          link: '/admin/list'
        },
        {
          name: 'Thêm QL kho',
          isLink: false
        }
      ]
    }
  };
  public id: any;
  public currentData: any;
  public allRole: any;
  public allRoleFilter: any;
  public selectedRole: any = [];
  public currentRole: any = [];
  public isCreate: boolean = true;
  public submitted: boolean = false;
  public form: FormGroup;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private _alertService: SweetAlertService
  ) { 
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) {
      this.isCreate = false;
      this.form.get('password').clearValidators();
      this.form.get('repassword').clearValidators();
      this.form.get('password').updateValueAndValidity();
      this.form.get('repassword').updateValueAndValidity();

      this.form.controls['username'].disable();
      this.form.controls['email'].disable();
      this.form.controls['mobile'].disable();

      this.contentHeader.headerTitle = "Update admin";
      this.contentHeader.breadcrumb.links[2].name = "Update admin";
    }
    
    this.currentData = this.router.getCurrentNavigation().extras.state;
    if(this.currentData && this.currentData != undefined) {
      this.form.patchValue({
        username: this.currentData.username,
        email: this.currentData.email,
        mobile: this.currentData.mobile,
        password: '',        
      })
    }
    if((!this.currentData || this.currentData == undefined) && this.id) {
      this.adminService.getOne(this.id).subscribe(res => {
        this.currentData = res.data;
        this.form.patchValue({
          username: this.currentData.username,
          email: this.currentData.email,
          mobile: this.currentData.mobile,
          password: '',        
        })
      })
    }else if(this.currentData && this.currentData != undefined) {
      this.form.patchValue({
        username: this.currentData.username,
        email: this.currentData.email,
        mobile: this.currentData.mobile,
        password: '',        
      })
    }
  }

  async onSubmitSave() {
    this.submitted = true;
    if(this.form.invalid) {        
      return;
    }
    if((await this._alertService.showConfirm("Bạn có đồng ý lưu dữ liệu?")).value) {            

      this.sectionBlockUI.start();
      if(this.isCreate) {      
      const data = {
        username: this.form.controls['username'].value,
        email: this.form.controls['email'].value,
        mobile: this.form.controls['mobile'].value.replace(" ", ""),
        password: this.form.controls['password'].value,
      };
      
      this.adminService.createInventoryManger(data).subscribe(res => {
        this.sectionBlockUI.stop();
        this.submitted = false;
        if(!res.status) {
          this._alertService.showError(res.message);
          return;
        }                   
        this._alertService.showSuccess(res.message);
        this.router.navigate(['admin/list']);
      }, error => {
        this.sectionBlockUI.stop();
        this._alertService.showError(error);
      });
    } else {
    }
    }
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {        
    this.getData();
  }

  getData(): void {
  }
  

}

