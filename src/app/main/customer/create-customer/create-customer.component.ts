import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'app/auth/service';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { FormOrganirationComponent } from 'app/main/shared/form-organiration/form-organiration.component';
import { FormPersonalComponent } from 'app/main/shared/form-personal/form-personal.component';
import { OrganizationDocComponent } from 'app/main/shared/organization-doc/organization-doc.component';
import { CommonService } from 'app/utils/common.service';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  @ViewChild(FormOrganirationComponent) formOrganization: FormOrganirationComponent;
  @ViewChild(FormPersonalComponent) formPeopleComponent: FormPersonalComponent;
  @ViewChild(OrganizationDocComponent) formOrganDoc: OrganizationDocComponent;

  public countries;
  public provinces;
  
  public dataInput: any;

  currentUser;
  isPersonal: boolean = false;
  isCreate;
  submitted: boolean = false;
  public id: any;

  public contentHeader: any =  {
    headerTitle: 'Thêm khách hàng',
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
          name: 'Thêm khách hàng',
          isLink: false
        }
      ]
    }
  };


  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private commonDataService: CommonDataService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private taskService: TaskService,

  ) {

    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();

   }

  ngOnInit(): void {
    this.getData();
  }

  onSubmitCreate() {
    let dataCreate = {
      created_by: this.currentUser.username,
      id_no: this.formPeopleComponent.formPeople.controls['identification_no'].value,
      id_type: this.formPeopleComponent.formPeople.controls['identification_type'].value,
      name: this.formPeopleComponent.formPeople.controls['name'].value,
      customer_type: "PERSONAL",
      address: this.formPeopleComponent.formPeople.controls['residence_full_address'].value,
      mobile: this.formPeopleComponent.formPeople.controls['mobile'].value,
      apeople: {}
    }
    this.formPeopleComponent.formPeople.controls['full_address'].setValue(this.formPeopleComponent.formPeople.controls.residence_full_address.value);
    this.formPeopleComponent.formPeople.controls['birth'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['birth_text'].value ))
    this.formPeopleComponent.formPeople.controls['identification_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_date_text'].value ))
    this.formPeopleComponent.formPeople.controls['identification_expire_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_expire_date_text'].value ))
    console.log(this.formPeopleComponent.formPeople.value);
    dataCreate.apeople = this.formPeopleComponent.formPeople.value;
    delete dataCreate.apeople['birth_text'];
    delete dataCreate.apeople['identification_date_text'];
    delete dataCreate.apeople['identification_expire_date_text'];
    this.submitted = true;
    // if(this.formPeopleComponent.formPeople.invalid) {
    //   this.submitted = false;
    //   return;
    // }
    this.userService.createCustomer(dataCreate).subscribe(res => {
      this.submitted = false;
      if(!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.alertService.showSuccess(res.message);
      setTimeout(function() {
          document.location.reload();
      }, 2000);
    }, error => {
      this.submitted = false;
      this.alertService.showMess(error);
    })
  }

  onSubmit() {
    if(this.id && this.id != undefined) {
      this.onSubmitUpdate();
    } else {
      this.onSubmitCreate();
    }
  }

  async onSubmitUpdate() {
    let dataUpdate= {
      created_by: this.currentUser.username,
      id_no: this.formPeopleComponent.formPeople.controls['identification_no'].value,
      id_type: this.formPeopleComponent.formPeople.controls['identification_type'].value,
      name: this.formPeopleComponent.formPeople.controls['name'].value,
      customer_type: "PERSONAL",
      address: this.formPeopleComponent.formPeople.controls['residence_full_address'].value,
      mobile: this.formPeopleComponent.formPeople.controls['mobile'].value,
      people: {}
    }
    this.formPeopleComponent.formPeople.controls['birth'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['birth_text'].value ))
    this.formPeopleComponent.formPeople.controls['identification_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_date_text'].value ))
    this.formPeopleComponent.formPeople.controls['identification_expire_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_expire_date_text'].value ))
    console.log(this.formPeopleComponent.formPeople.value);
    dataUpdate.people = this.formPeopleComponent.formPeople.value;

    delete dataUpdate.people['birth_text'];
    delete dataUpdate.people['identification_date_text'];
    delete dataUpdate.people['identification_expire_date_text'];
    delete dataUpdate.people['signature'];
    


    this.submitted = true;

    console.log(this.formPeopleComponent.formPeople.invalid)

    if (!this.formPeopleComponent.formPeople.invalid && (await this.alertService.showConfirm("Bạn có chắc chắn muốn cập nhật thông tin?")).value) {
      this.sectionBlockUI.start();
      this.taskService.patchUpdateCustomer(this.id, dataUpdate).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.commonDataService.getContries().subscribe(res => {
      this.countries = res.data;
    });
    this.commonDataService.getProvinces().subscribe(res => {
      this.provinces = res.data;
    })

    if(this.id && this.id != undefined) {
      this.taskService.getDetailCustomer(this.id).subscribe(res => {
        if (res.status && res.data) {
          this.dataInput = res.data;
        }
      })
    }    
  }

}
