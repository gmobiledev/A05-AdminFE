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

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  @ViewChild(FormOrganirationComponent) formOrganization: FormOrganirationComponent;
  @ViewChild(FormPersonalComponent) formPeople: FormPersonalComponent;
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
      id_no: this.formPeople.formPeople.controls['identification_no'].value,
      id_type: this.formPeople.formPeople.controls['identification_type'].value,
      name: this.formPeople.formPeople.controls['name'].value,
      customer_type: "PERSONAL",
      address: this.formPeople.formPeople.controls['residence_full_address'].value,
      mobile: this.formPeople.formPeople.controls['mobile'].value,
      apeople: {}
    }
    this.formPeople.formPeople.controls['birth'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeople.formPeople.controls['birth_text'].value ))
    this.formPeople.formPeople.controls['identification_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeople.formPeople.controls['identification_date_text'].value ))
    this.formPeople.formPeople.controls['identification_expire_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeople.formPeople.controls['identification_expire_date_text'].value ))
    console.log(this.formPeople.formPeople.value);
    dataCreate.apeople = this.formPeople.formPeople.value;
    delete dataCreate.apeople['birth_text'];
    delete dataCreate.apeople['identification_date_text'];
    delete dataCreate.apeople['identification_expire_date_text'];
    this.submitted = true;
    // if(this.formPeople.formPeople.invalid) {
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
    console.log(this.formOrganization.formOrganization.value)
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.commonDataService.getContries().subscribe(res => {
      this.countries = res.data;
    });
    this.commonDataService.getProvinces().subscribe(res => {
      this.provinces = res.data;
    })

    this.taskService.getDetailCustomer(this.id).subscribe(res => {
      if (res.status && res.data) {
        this.dataInput = res.data;
      }
    })

  }

}
