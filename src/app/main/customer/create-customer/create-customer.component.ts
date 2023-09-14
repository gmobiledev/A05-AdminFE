import { Component, OnInit, ViewChild } from '@angular/core';
import { FormOrganirationComponent } from 'app/main/shared/form-organiration/form-organiration.component';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  @ViewChild(FormOrganirationComponent) formOrganization: FormOrganirationComponent;

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
