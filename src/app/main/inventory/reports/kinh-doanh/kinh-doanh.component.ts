import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-kinh-doanh',
  templateUrl: './kinh-doanh.component.html',
  styleUrls: ['./kinh-doanh.component.scss']
})
export class KinhDoanhComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader = {
    headerTitle: 'Báo cáo tiêu dùng',
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
          name: 'Báo cáo tiêu dùng',
          isLink: false
        }
      ]
    }
  };
  constructor() { }

  ngOnInit(): void {
  }

}
