import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-order-ltg',
  templateUrl: './create-order-ltg.component.html',
  styleUrls: ['./create-order-ltg.component.scss']
})
export class CreateOrderLtgComponent implements OnInit {

  public contentHeader: any;
  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo đơn giao vật tư LTG',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Đơn giao vật tư',
            isLink: true,
            link: '/'
          },
          {
            name: 'Tạo mới',
            isLink: false
          }
        ]
      }
    };
  }

}
