import { Component, OnInit, ViewChild } from '@angular/core';
import { FormOrganirationComponent } from 'app/main/shared/form-organiration/form-organiration.component';
import { FormPersonalComponent } from 'app/main/shared/form-personal/form-personal.component';
import { OrganizationDocComponent } from 'app/main/shared/organization-doc/organization-doc.component';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  @ViewChild(FormOrganirationComponent) formOrganization: FormOrganirationComponent;
  @ViewChild(FormPersonalComponent) formPeople: FormPersonalComponent;
  @ViewChild(OrganizationDocComponent) formOrganDoc: OrganizationDocComponent;

  isPersonal: boolean = false;
  isCreate

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

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.formOrganization.formOrganization.value)
  }

}
