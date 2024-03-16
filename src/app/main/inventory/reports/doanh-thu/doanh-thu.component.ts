import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-doanh-thu',
  templateUrl: './doanh-thu.component.html',
  styleUrls: ['./doanh-thu.component.scss']
})
export class DoanhThuComponent implements OnInit {
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Tạo phiếu xuất kho',
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
          name: 'Báo cáo doanh thu',
          isLink: false
        }
      ]
    }
  };

  constructor() { }


  ngOnInit(): void {
  }

}
