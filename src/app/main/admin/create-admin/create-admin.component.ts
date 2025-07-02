import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'app/auth/service/admin.service';
import { RoleService } from 'app/auth/service/role.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {
  public contentHeader: any =  {
    headerTitle: 'Thêm admin',
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
          name: 'Danh sách tài khoản',
          isLink: true,
          link: '/admin/list'
        },
        {
          name: 'Thêm admin',
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
    private rolService: RoleService,
    private adminService: AdminService,
    private _alertService: SweetAlertService
  ) { 
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.email],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      role: new FormArray([])
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

  onSearch(event) {
    const value = event.target.value;
    
    if(value && value != '') {
      this.allRoleFilter = this.allRole.filter(item => { return item.name.toLowerCase().includes(value.toLowerCase()) });
    } else {
      this.allRoleFilter = this.allRole;
    }
  }

  onChange(event, item) {
    const formArray: FormArray = this.form.get('role') as FormArray;    
    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.selectedRole = this.form.controls['role'].value;
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
      
      this.adminService.create(data).subscribe(res => {
        this.sectionBlockUI.stop();
        this.submitted = false;
        if(!res.status) {
          this._alertService.showError(res.message);
          return;
        }
        const dataRole = this.selectedRole.map(x => {return {item_name: x, user_id: res.data.id}});
        this.adminService.addRole(res.data.id, dataRole).subscribe(resR => {
          if(!resR.status) {
            this._alertService.showError(res.message);
            return;
          }
          this.form.patchValue({
            username: '',
            email: '',
            mobile: '',
            password: '',
            repassword: '',
            role: []
          });
          this._alertService.showSuccess(resR.message);
        })                
      }, error => {
        this.sectionBlockUI.stop();
        this._alertService.showError(error);
      });
    } else {
      // const addRole = this.selectedRole.filter( x => !this.currentRole.includes(x));
      // const dataAdd = addRole.map(x => {return {item_name: x, user_id: this.id}});
      // if(dataAdd.length > 0) {

      // }
      const deletedRole = this.currentRole.filter( x => !this.selectedRole.includes(x));
      const dataDelete = deletedRole.map(x => {return {item_name: x, user_id: this.id}});
      if(dataDelete.length > 0) {
        this.adminService.removeRole(this.id, dataDelete).subscribe(resD => {
          
        })
      }        

      const dataRole = this.selectedRole.map(x => {return {item_name: x, user_id: this.id}});
        this.adminService.addRole(this.id, dataRole).subscribe(resR => {
          this.sectionBlockUI.start();
          if(!resR.status) {
            this._alertService.showError(resR.message);
            return;
          }
          this.form.patchValue({
            username: '',
            email: '',
            mobile: '',
            password: '',
            repassword: '',
            role: []
          });
          this._alertService.showSuccess(resR.message);
        },error => {
          this.sectionBlockUI.stop();
          this._alertService.showError(error);
        })
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
    this.rolService.getAll().subscribe(res => {
      this.allRole = res.data;
      this.allRoleFilter = res.data;
    });
    if(this.id) {
      this.rolService.getByUser(this.id).subscribe(res => {
        this.selectedRole = res.data.map(x => {return x.item_name});
        this.currentRole  = res.data.map(x => {return x.item_name});

        const formArray: FormArray = this.form.get('role') as FormArray; 

        if(this.selectedRole && this.selectedRole.length > 0) {
          this.selectedRole.forEach(element => {
            formArray.push(new FormControl(element));
          });
        }
      })
    }
  }
  

}
